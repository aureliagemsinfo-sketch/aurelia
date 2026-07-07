export type HeaderTheme = "dark-media" | "light-media";

export type HeaderRouteConfig = {
  topTheme: HeaderTheme;
};

export const headerRouteConfigs: Record<string, HeaderRouteConfig> = {
  "/": { topTheme: "light-media" },
};

export function getHeaderConfig(pathname: string): HeaderRouteConfig {
  // If the pathname matches a specific route config, use it.
  // Otherwise, default to "light-media" for all inner pages to ensure contrast safety.
  return headerRouteConfigs[pathname] || { topTheme: "light-media" };
}
