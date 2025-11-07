import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { formatDistance } from 'date-fns';
import {
  CustomError,
  GENERIC_ERROR,
  INVALID_CONFIG_ERROR,
  INVALID_GITHUB_USERNAME_ERROR,
  setTooManyRequestError,
} from '../constants/errors';
import '../assets/index.css';
import { getInitialTheme, getSanitizedConfig, setupHotjar } from '../utils';
import { SanitizedConfig } from '../interfaces/sanitized-config';
import ErrorPage from './error-page';
import { DEFAULT_THEMES } from '../constants/default-themes';
import ThemeChanger from './theme-changer';
import { BG_COLOR } from '../constants';
import AvatarCard from './avatar-card';
import { Profile } from '../interfaces/profile';
import DetailsCard from './details-card';
import SkillCard from './skill-card';
import EducationCard from './education-card';
import CertificationCard from './certification-card';
import { GithubProject } from '../interfaces/github-project';
import ExternalProjectCard from './external-project-card';
import Footer from './footer';
import { profileAPI, projectsAPI, BackendProfile, BackendProject } from '../services/api';
import { default as BackendProjectCard } from './backend-project-card';

/**
 * Renders the GitProfile component.
 *
 * @param {Object} config - the configuration object
 * @return {JSX.Element} the rendered GitProfile component
 */
const GitProfile = ({ config }: { config: SanitizedConfig }) => {
  const [sanitizedConfig] = useState<SanitizedConfig | Record<string, never>>(
    getSanitizedConfig(config),
  );
  const [theme, setTheme] = useState<string>(DEFAULT_THEMES[0]);
  const [error, setError] = useState<CustomError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [, setGithubProjects] = useState<GithubProject[]>([]); // Keep for github projects if needed
  const [displayProfile, setDisplayProfile] = useState<Profile | null>(null);
  const [backendProfile, setBackendProfile] = useState<Profile | null>(null);

  const getGithubProjects = useCallback(
    async (publicRepoCount: number): Promise<GithubProject[]> => {
      if (sanitizedConfig.projects.github.mode === 'automatic') {
        if (publicRepoCount === 0) {
          return [];
        }

        const excludeRepo =
          sanitizedConfig.projects.github.automatic.exclude.projects
            .map((project) => `+-repo:${project}`)
            .join('');

        const query = `user:${sanitizedConfig.github.username}+fork:${!sanitizedConfig.projects.github.automatic.exclude.forks}${excludeRepo}`;
        const url = `https://api.github.com/search/repositories?q=${query}&sort=${sanitizedConfig.projects.github.automatic.sortBy}&per_page=${sanitizedConfig.projects.github.automatic.limit}&type=Repositories`;

        const repoResponse = await axios.get(url, {
          headers: { 'Content-Type': 'application/vnd.github.v3+json' },
        });
        const repoData = repoResponse.data;

        return repoData.items;
      } else {
        if (sanitizedConfig.projects.github.manual.projects.length === 0) {
          return [];
        }
        const repos = sanitizedConfig.projects.github.manual.projects
          .map((project) => `+repo:${project}`)
          .join('');

        const url = `https://api.github.com/search/repositories?q=${repos}+fork:true&type=Repositories`;

        const repoResponse = await axios.get(url, {
          headers: { 'Content-Type': 'application/vnd.github.v3+json' },
        });
        const repoData = repoResponse.data;

        return repoData.items;
      }
    },
    [
      sanitizedConfig.github.username,
      sanitizedConfig.projects.github.mode,
      sanitizedConfig.projects.github.manual.projects,
      sanitizedConfig.projects.github.automatic.sortBy,
      sanitizedConfig.projects.github.automatic.limit,
      sanitizedConfig.projects.github.automatic.exclude.forks,
      sanitizedConfig.projects.github.automatic.exclude.projects,
    ],
  );

  const loadBackendData = useCallback(async () => {
    try {
      // Tải dữ liệu profile chính từ backend
      const backendProfileData: BackendProfile = await profileAPI.getProfile();
      // Tải dữ liệu certifications và educations riêng biệt
      const certificationsData = await profileAPI.getCertifications();
      const educationsData = await profileAPI.getEducations();

      const newBackendProfile = {
        avatar: backendProfileData.avatarUrl,
        name: backendProfileData.name,
        bio: backendProfileData.bio,
        title: backendProfileData.title,
        // Giả định contact luôn tồn tại nếu email có, nếu không thì xử lý null/undefined
        email: backendProfileData.contact?.email, // Assuming contact is always present if email is
        phone: backendProfileData.contact?.phone,
        location: backendProfileData.contact?.location,
        socials: backendProfileData.contact?.socials,
        certifications: certificationsData, // Gán dữ liệu certifications đã fetch
        educations: educationsData, // Gán dữ liệu educations đã fetch
        skills: backendProfileData.skills,
      };
      setBackendProfile(newBackendProfile);

      // Load backend projects
      // const projects = await projectsAPI.getAllProjects();
      // setBackendProjects(projects);
    } catch (error) {
      console.error('Error loading backend data:', error);
      // Don't set error state for backend data - it's optional
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.github.com/users/${sanitizedConfig.github.username}`,
      );
      const data = response.data;

      setGithubProjects(await getGithubProjects(data.public_repos));
    } catch (error) {
      handleError(error as AxiosError | Error);
    } finally {
      setLoading(false);
    }
  }, [
    sanitizedConfig.github.username,
    sanitizedConfig.projects.github.display,
    getGithubProjects, // Added getGithubProjects to dependencies
  ]);

  const [backendProjects, setBackendProjects] = useState<BackendProject[]>([]);

  const loadBackendProjects = useCallback(async () => {
    if (sanitizedConfig.projects.external.projects.length === 0) {
      try {
        const projects = await projectsAPI.getAllProjects();
        setBackendProjects(projects);
      } catch (err) {
        console.error("Error loading backend projects", err);
      }
    }
  }, [sanitizedConfig.projects.external.projects]);

  const handleError = useCallback((error: AxiosError | Error): void => {
    console.error('Error:', error);

    if (error instanceof AxiosError) {
      try {
        const reset = formatDistance(
          new Date(error.response?.headers?.['x-ratelimit-reset'] * 1000),
          new Date(),
          { addSuffix: true },
        );

        if (typeof error.response?.status === 'number') {
          switch (error.response.status) {
            case 403:
              setError(setTooManyRequestError(reset));
              break;
            case 404:
              setError(INVALID_GITHUB_USERNAME_ERROR);
              break;
            default:
              setError(GENERIC_ERROR);
              break;
          }
        } else {
          setError(GENERIC_ERROR);
        }
      } catch (innerError) {
        setError(GENERIC_ERROR);
      }
    } else {
      setError(GENERIC_ERROR);
    }
  }, [setError]);

  useEffect(() => {
    if (Object.keys(sanitizedConfig).length === 0) {
      setError(INVALID_CONFIG_ERROR);
    } else {
      setError(null);
      setTheme(getInitialTheme(sanitizedConfig.themeConfig));
      setupHotjar(sanitizedConfig.hotjar);
      loadData();
      loadBackendData();
      loadBackendProjects();
    }
  }, [sanitizedConfig, loadData, loadBackendData, loadBackendProjects, handleError]);

  useEffect(() => {
    theme && document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Effect to merge profile data
  useEffect(() => {
    // Prioritize backend profile. Fallback to github profile.
    const newDisplayProfile = backendProfile;
    setDisplayProfile(newDisplayProfile); // Set displayProfile here
  }, [backendProfile]);

  return (
    <div className="fade-in h-screen">
      {error ? (
        <ErrorPage
          status={error.status}
          title={error.title}
          subTitle={error.subTitle}
        />
      ) : (
        <>
          <div className={`p-4 lg:p-10 min-h-full ${BG_COLOR}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-box">
              <div className="col-span-1">
                <div className="grid grid-cols-1 gap-6">
                  {!sanitizedConfig.themeConfig.disableSwitch && (
                    <ThemeChanger
                      theme={theme}
                      setTheme={setTheme}
                      loading={loading}
                      themeConfig={sanitizedConfig.themeConfig}
                    />
                  )}
                  <AvatarCard
                    profile={displayProfile}
                    loading={loading}
                    avatarRing={sanitizedConfig.themeConfig.displayAvatarRing}
                    resumeFileUrl={sanitizedConfig.resume.fileUrl}
                  />
                  <DetailsCard
                    profile={displayProfile}
                    loading={loading}
                    github={sanitizedConfig.github}
                    social={sanitizedConfig.social}
                  />
                  {displayProfile?.skills && displayProfile.skills.length > 0 && (
                    <SkillCard
                      loading={loading}
                      skills={displayProfile.skills}
                    />
                  )}
                  {displayProfile?.certifications && displayProfile.certifications.length > 0 && (
                    <CertificationCard
                      loading={loading}
                      certifications={displayProfile.certifications}
                    />
                  )}
                  {displayProfile?.educations && displayProfile.educations.length > 0 && (
                    <EducationCard
                      loading={loading}
                      educations={displayProfile.educations as any}
                    />
                  )}
                </div>
              </div>
              <div className="lg:col-span-2 col-span-1">
                <div className="grid grid-cols-1 gap-6">
                  {sanitizedConfig.projects.external.projects.length ? (
                    <ExternalProjectCard
                      header={sanitizedConfig.projects.external.header}
                      externalProjects={sanitizedConfig.projects.external.projects}
                      loading={loading}
                      googleAnalyticId={sanitizedConfig.googleAnalytics.id}
                    />
                  ) : (
                    <BackendProjectCard
                      header="My Projects"
                      backendProjects={backendProjects}
                      loading={loading}
                      googleAnalyticId={sanitizedConfig.googleAnalytics.id}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {sanitizedConfig.footer && (
            <footer
              className={`p-4 footer ${BG_COLOR} text-base-content footer-center`}
            >
              <div className="card card-sm bg-base-100 shadow-sm">
                <Footer content={sanitizedConfig.footer} loading={loading} />
              </div>
            </footer>
          )}
        </>
      )}
    </div>
  );
};

export default GitProfile;
