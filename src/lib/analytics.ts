type AnalyticsEvent = {
  name: string;
  payload?: Record<string, string | number | boolean | undefined>;
};

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("nf:analytics", { detail: event }));
}
