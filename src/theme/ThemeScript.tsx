import type { Theme } from './ThemeProvider';

export interface ThemeScriptProps {
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  nonce?: string;
}

export function getThemeInitScript({
  defaultTheme = 'system',
  storageKey = 'eta-ui-theme',
  enableSystem = true,
}: Omit<ThemeScriptProps, 'nonce'> = {}): string {
  const safeKey = JSON.stringify(storageKey);
  const safeDefault = JSON.stringify(defaultTheme);
  const allowSystem = enableSystem ? 'true' : 'false';

  return `(function(){try{var d=document.documentElement,k=${safeKey},t=${safeDefault},s=localStorage.getItem(k);var m=(s==='light'||s==='dark'||s==='system')?s:t;var r=m;if(m==='system'){r=(${allowSystem}&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';}else{r=m==='dark'?'dark':'light';}d.setAttribute('data-theme',r);if(r==='dark'){d.classList.add('dark');}else{d.classList.remove('dark');}d.style.colorScheme=r;}catch(e){}})();`;
}

export function ThemeScript({
  defaultTheme = 'system',
  storageKey = 'eta-ui-theme',
  enableSystem = true,
  nonce,
}: ThemeScriptProps) {
  const code = getThemeInitScript({ defaultTheme, storageKey, enableSystem });

  return (
    <script
      nonce={nonce}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}

ThemeScript.displayName = 'ThemeScript';
