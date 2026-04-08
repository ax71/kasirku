import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

const DashboardBreadcrumb = () => {
  const location = useLocation();
  const paths = location.pathname.split("/").slice(1);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => (
          <Fragment key={`path-${path}`}>
            <BreadcrumbItem className="capitalize">
              {index < paths.length - 1 ? (
                <BreadcrumbLink
                  href={`/${paths.slice(0, index + 1).join("/")}`}
                >
                  {path}
                </BreadcrumbLink>
              ) : (
                path
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DashboardBreadcrumb;
