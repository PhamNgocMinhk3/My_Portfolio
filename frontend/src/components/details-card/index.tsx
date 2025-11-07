import { Fragment } from 'react';
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai';

import { FaBuilding, FaGlobe } from 'react-icons/fa';

import { MdLocationOn } from 'react-icons/md';
import {RiMailFill, RiPhoneFill } from 'react-icons/ri';
import { Profile } from '../../interfaces/profile';
import {
  SanitizedGithub,
  SanitizedSocial,
} from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';

type Props = {
  profile: Profile | null;
  loading: boolean;
  social: SanitizedSocial;
  github: SanitizedGithub;
};

const isCompanyMention = (company: string): boolean => {
  return company.startsWith('@') && !company.includes(' ');
};

const companyLink = (company: string): string => {
  return `https://github.com/${company.substring(1)}`;
};





const ListItem: React.FC<{
  icon: React.ReactNode;
  title: React.ReactNode;
  value: React.ReactNode;
  link?: string;
  skeleton?: boolean;
}> = ({ icon, title, value, link, skeleton = false }) => {
  return (
    <div className="flex justify-start py-2 px-1 items-center">
      <div className="grow font-medium gap-2 flex items-center my-1">
        {icon} {title}
      </div>
      <div
        className={`${
          skeleton ? 'grow' : ''
        } text-sm font-normal text-right mr-2 ml-3 ${link ? 'truncate' : ''}`}
        style={{
          wordBreak: 'break-word',
        }}
      >
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="flex justify-start py-2 px-1 items-center"
        >
          {value}
        </a>
      </div>
    </div>
  );
};

const OrganizationItem: React.FC<{
  icon: React.ReactNode;
  title: React.ReactNode;
  value: React.ReactNode | string;
  link?: string;
  skeleton?: boolean;
}> = ({ icon, title, value, link, skeleton = false }) => {
  const renderValue = () => {
    if (typeof value === 'string') {
      return value.split(' ').map((company) => {
        company = company.trim();
        if (!company) return null;

        if (isCompanyMention(company)) {
          return (
            <a
              href={companyLink(company)}
              target="_blank"
              rel="noreferrer"
              key={company}
            >
              {company}
            </a>
          );
        } else {
          return <span key={company}>{company}</span>;
        }
      });
    }
    return value;
  };

  return (
    <div className="flex justify-start py-2 px-1 items-center">
      <div className="grow font-medium gap-2 flex items-center my-1">
        {icon} {title}
      </div>
      <div
        className={`${
          skeleton ? 'grow' : ''
        } text-sm font-normal text-right mr-2 ml-3 space-x-2 ${link ? 'truncate' : ''}`}
        style={{
          wordBreak: 'break-word',
        }}
      >
        {renderValue()}
      </div>
    </div>
  );
};

const renderSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return <AiFillLinkedin />;
    case 'github':
      return <AiFillGithub />;
    default:
      return <FaGlobe />;
  }
};
/**
 * Renders the details card component.
 *
 * @param {Object} profile - The profile object.
 * @param {boolean} loading - Indicates whether the data is loading.
 * @param {Object} social - The social object.
 * @param {Object} github - The GitHub object.
 * @return {JSX.Element} The details card component.
 */
const DetailsCard = ({ profile, loading }: Props) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 4; index++) {
      array.push(
        <ListItem
          key={index}
          skeleton={true}
          icon={skeleton({ widthCls: 'w-4', heightCls: 'h-4' })}
          title={skeleton({ widthCls: 'w-24', heightCls: 'h-4' })}
          value={skeleton({ widthCls: 'w-full', heightCls: 'h-4' })}
        />,
      );
    }

    return array;
  };

  return (
    <div className="card shadow-lg card-sm bg-base-100">
      <div className="card-body">
        <div className="text-base-content">
          {loading || !profile ? (
            renderSkeleton()
          ) : (
            <Fragment>
              {profile.location && (
                <ListItem
                  icon={<MdLocationOn />}
                  title="Based in:"
                  value={profile.location}
                />
              )}
              {profile.company && (
                <OrganizationItem
                  icon={<FaBuilding />}
                  title="Organization:"
                  value={profile.company}
                  link={
                    isCompanyMention(profile.company.trim())
                      ? companyLink(profile.company.trim())
                      : undefined
                  }
                />
              )}
              {/* Dynamically render socials from backend */}
              {profile.socials?.map((social) => (
                <ListItem
                  key={social.platform}
                  icon={renderSocialIcon(social.platform)}
                  title={`${social.platform}:`}
                  value={social?.name || social.url}
                  link={social.url}
                />
              ))}
              {profile?.phone && (
                <ListItem
                  icon={<RiPhoneFill />}
                  title="Phone:"
                  value={profile.phone}
                  link={`tel:${profile.phone}`}
                />
              )}
              {profile?.email && (
                <ListItem
                  icon={<RiMailFill />}
                  title="Email:"
                  value={profile.email}
                  link={`mailto:${profile.email}`}
                />
              )}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsCard;
