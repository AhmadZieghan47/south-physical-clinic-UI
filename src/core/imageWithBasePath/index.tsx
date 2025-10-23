
import { img_path } from '../../environment';


interface Image {
  className?: string;
  src: string;
  alt?: string;
  height?: number;
  width?: number;
  id?:string;
}

const ImageWithBasePath = (props: Image) => {
  // Normalize provided src to be root-relative unless it's an absolute URL
  const isAbsoluteUrl = /^https?:\/\//i.test(props.src);
  const normalizedPath = isAbsoluteUrl
    ? props.src
    : `/${props.src.replace(/^\/+/, '')}`; // ensure leading '/'

  // Join with optional base path, avoiding double slashes
  const base = (img_path || '').replace(/\/$/, '');
  const fullSrc = isAbsoluteUrl ? normalizedPath : `${base}${normalizedPath}`;
  return (
    <img
      className={props.className}
      src={fullSrc}
      height={props.height}
      alt={props.alt}
      width={props.width}
      id={props.id}
    />
  );
};

export default ImageWithBasePath;
