import { BackendProject } from '../../services/api';
import { AiFillGithub } from 'react-icons/ai';
import { ga, skeleton } from '../../utils';

const BackendProjectCard = ({
  backendProjects,
  header,
  loading,
  googleAnalyticId,
}: {
  backendProjects: BackendProject[];
  header: string;
  loading: boolean;
  googleAnalyticId?: string;
}) => {
  const renderSkeleton = () => {
    return Array.from(Array(2).keys()).map((index) => (
      <div className="card shadow-lg compact bg-base-100" key={index}>
        <div className="p-8 h-full w-full">
          <div className="flex items-start flex-col h-full">
            <div className="w-full">
              <h2 className="flex items-center">
                {skeleton({
                  widthCls: 'w-32',
                  heightCls: 'h-8',
                  className: 'mb-2',
                })}
              </h2>
              <p className="mb-5 mt-1">
                {skeleton({
                  widthCls: 'w-full',
                  heightCls: 'h-4',
                  className: 'mb-1',
                })}
                {skeleton({
                  widthCls: 'w-1/2',
                  heightCls: 'h-4',
                })}
              </p>
              <div className="flex flex-wrap justify-start mt-auto">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="mr-2 mb-2">
                    {skeleton({
                      widthCls: 'w-20',
                      heightCls: 'h-4',
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="card shadow-lg compact bg-base-100">
      <div className="card-body">
        <div className="mx-3">
          <h5 className="card-title">
            {loading ? (
              skeleton({ widthCls: 'w-40', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">{header}</span>
            )}
          </h5>
        </div>
        <div className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading
              ? renderSkeleton()
              : backendProjects.map((project, index) => (
                  <a
                    className="card shadow-lg compact bg-base-100 cursor-pointer"
                    key={index}
                    href={project.githubUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      try {
                        if (googleAnalyticId) {
                          ga.event('Click Backend Project', { project: project.title });
                        }
                      } catch (error) {
                        console.error(error);
                      }
                      window?.open(project.githubUrl, '_blank');
                    }}
                  >
                    {/* --- BẮT ĐẦU KHỐI ĐÃ SỬA --- */}
                    <div className="p-8 h-full w-full">
                      {/* SỬA 1: Dùng flex-col và justify-between 
                        để đẩy nội dung ra 2 đầu (trên và dưới) 
                      */}
                      <div className="flex flex-col h-full justify-between">
                        
                        {/* Phần 1: Title và Description */}
                        <div className="w-full">
                          <h2 className="flex items-center font-bold text-lg opacity-80 mb-2">
                            <AiFillGithub className="mr-2" />
                            {project.title}
                          </h2>
                          {/* SỬA 2: Thêm 'break-words' để ngắt các từ dài 
                            (như chuỗi Web3-Solidit... của bạn)
                          */}
                          <p className="mb-5 mt-1 text-base-content text-sm opacity-70 break-words">
                            {project.description}
                          </p>
                        </div>

                        {/* Phần 2: Tags Công nghệ */}
                        {/* SỬA 3: Bỏ 'mt-auto' vì 'justify-between' ở trên đã xử lý */}
                        <div className="flex flex-wrap justify-start">
                          {project.technologies?.map((tech, i) => (
                            <div key={i} className="badge badge-outline badge-primary mr-2 mb-2">
                              {tech}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* --- KẾT THÚC KHỐI ĐÃ SỬA --- */}
                  </a>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendProjectCard;