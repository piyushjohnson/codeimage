import {SvgIcon, SvgIconProps} from '@codeimage/ui';

export const DownloadIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon fill="none" viewBox="0 0 24 24" stroke="white" {...props}>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </SvgIcon>
  );
};
