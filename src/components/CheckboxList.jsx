import ContentLoader from "react-content-loader";

const CheckboxList = (props) => (
  <ContentLoader
    speed={2}
    width={450}
    height={250}
    viewBox="0 0 400 200"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="10" y="12" rx="4" ry="4" width="20" height="20" />
    <rect x="40" y="15" rx="4" ry="4" width="240" height="16" />
    <rect x="330" y="14" rx="4" ry="4" width="20" height="20" />
    <rect x="360" y="14" rx="4" ry="4" width="20" height="20" />
    <rect x="10" y="54" rx="4" ry="4" width="20" height="20" />
    <rect x="40" y="57" rx="4" ry="4" width="240" height="16" />
    <rect x="330" y="56" rx="4" ry="4" width="20" height="20" />
    <rect x="360" y="56" rx="4" ry="4" width="20" height="20" />
    <rect x="10" y="96" rx="4" ry="4" width="20" height="20" />
    <rect x="40" y="99" rx="4" ry="4" width="240" height="16" />
    <rect x="330" y="98" rx="4" ry="4" width="20" height="20" />
    <rect x="360" y="98" rx="4" ry="4" width="20" height="20" />
    <rect x="10" y="138" rx="4" ry="4" width="20" height="20" />
    <rect x="40" y="141" rx="4" ry="4" width="240" height="16" />
    <rect x="330" y="140" rx="4" ry="4" width="20" height="20" />
    <rect x="360" y="140" rx="4" ry="4" width="20" height="20" />
  </ContentLoader>
);

export default CheckboxList;
