// src/theme/theme.js
import { theme as antdTheme } from 'antd';

export const customTheme = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    // 🎨 Màu sắc tương đương MUI palette
  // Blue Minimal style
  colorPrimary: '#0B74FF',
  colorTextBase: '#1A2233',
  colorBgBase: '#F7FBFF',
  colorError: '#DB4444',
  colorLink: '#0B74FF',
  colorTextHeading: '#0F1724',
  borderRadius: 8,
  boxShadow: '0 4px 14px rgba(2,6,23,0.06)',

    // ✍️ Font
  fontFamily: 'Poppins, sans-serif',
  fontSize: 16, // body1

  // ⚙️ Breakpoints (AntD dùng cho Grid, Layout)
  // Use valid increasing breakpoint values (AntD defaults are close to these)
  // Avoid setting screenXS to 0 because AntD expects internal min/max ordering.
  // AntD typical breakpoints: xs:480, sm:576, md:768, lg:992, xl:1200, xxl:1600
  screenXS: 480,
  screenSM: 576,
  screenMD: 768,
  screenLG: 992,
  screenXL: 1200,
  screenXXL: 1600,
  },
  components: {
    Typography: {
      fontFamily: 'Poppins, sans-serif',
    },
    Button: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 500,
    },
  },
};
