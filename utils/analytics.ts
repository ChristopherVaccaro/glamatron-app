import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-9JNFNQ6SFJ';

// Initialize Google Analytics
export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

// Track page views (for SPA navigation if you add routing later)
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

// Custom event tracking for user actions
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Predefined events for Glamatron
export const Analytics = {
  // User events
  userSignup: (method: string) => trackEvent('User', 'Signup', method),
  userLogin: (method: string) => trackEvent('User', 'Login', method),
  userLogout: () => trackEvent('User', 'Logout'),

  // Photo events
  photoUpload: () => trackEvent('Photo', 'Upload'),
  photoCapture: () => trackEvent('Photo', 'Camera Capture'),

  // Style generation events
  styleGeneration: (styleName: string) => trackEvent('Generation', 'Style Applied', styleName),
  generationSuccess: (styleName: string) => trackEvent('Generation', 'Success', styleName),
  generationError: (error: string) => trackEvent('Generation', 'Error', error),

  // Coin events
  coinPurchaseModalOpen: () => trackEvent('Coins', 'Purchase Modal Opened'),
  coinPurchase: (amount: number) => trackEvent('Coins', 'Purchase', undefined, amount),
  subscriptionStart: () => trackEvent('Subscription', 'Started'),

  // Gallery events
  galleryView: () => trackEvent('Gallery', 'Viewed'),
  imageSaved: () => trackEvent('Gallery', 'Image Saved'),
  imageDownloaded: () => trackEvent('Gallery', 'Image Downloaded'),
  imageShared: () => trackEvent('Gallery', 'Image Shared'),

  // UI interactions
  categorySelected: (category: string) => trackEvent('UI', 'Category Selected', category),
  styleSelected: (style: string) => trackEvent('UI', 'Style Selected', style),
};
