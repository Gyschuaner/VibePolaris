export const offlineFirstSources = [
  { publisher: "Android Developers", title: "Build an offline-first app", date: "", url: "https://developer.android.com/topic/architecture/data-layer/offline-first", citations: ["offline-layer", "offline-queue"] },
  { publisher: "Android Developers", title: "Data layer", date: "", url: "https://developer.android.com/topic/architecture/data-layer", citations: ["offline-source"] },
  { publisher: "MDN Web Docs", title: "Using IndexedDB", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB", citations: ["offline-persist"] },
  { publisher: "MDN Web Docs", title: "Service Worker API", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API", citations: ["offline-cache"] },
  { publisher: "Chrome for Developers", title: "Workbox Background Sync", date: "", url: "https://developer.chrome.com/docs/workbox/modules/workbox-background-sync", citations: ["offline-retry"] },
];

export const adaptiveLayoutSources = [
  { publisher: "Android Developers", title: "Adaptive layouts", date: "", url: "https://developer.android.com/develop/ui/compose/layouts/adaptive", citations: ["adaptive-window", "adaptive-fold"] },
  { publisher: "Android Developers", title: "Use window size classes", date: "", url: "https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes", citations: ["adaptive-size"] },
  { publisher: "W3C", title: "Media Queries Level 4", date: "", url: "https://www.w3.org/TR/mediaqueries-4/", citations: ["adaptive-media"] },
  { publisher: "MDN Web Docs", title: "Responsive design", date: "", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design", citations: ["adaptive-responsive"] },
  { publisher: "MDN Web Docs", title: "CSS container queries", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries", citations: ["adaptive-container"] },
];

export const safeAreaSources = [
  { publisher: "Apple Developer", title: "Positioning content relative to the safe area", date: "", url: "https://developer.apple.com/documentation/uikit/positioning-content-relative-to-the-safe-area", citations: ["safe-area-native"] },
  { publisher: "W3C", title: "CSS Environment Variables Module Level 1", date: "", url: "https://www.w3.org/TR/css-env-1/", citations: ["safe-area-env"] },
  { publisher: "Android Developers", title: "WindowInsets", date: "", url: "https://developer.android.com/reference/android/view/WindowInsets", citations: ["safe-area-insets"] },
  { publisher: "Android Developers", title: "Support display cutouts", date: "", url: "https://developer.android.com/develop/ui/views/layout/display-cutout", citations: ["safe-area-cutout"] },
  { publisher: "MDN Web Docs", title: "env() CSS function", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/env", citations: ["safe-area-web"] },
];

export const appLifecycleSources = [
  { publisher: "Android Developers", title: "The activity lifecycle", date: "", url: "https://developer.android.com/guide/components/activities/activity-lifecycle", citations: ["lifecycle-states", "lifecycle-stop"] },
  { publisher: "Android Developers", title: "Save UI states", date: "", url: "https://developer.android.com/topic/libraries/architecture/saving-states", citations: ["lifecycle-save"] },
  { publisher: "MDN Web Docs", title: "Page Visibility API", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API", citations: ["lifecycle-hidden"] },
  { publisher: "Chrome for Developers", title: "Page Lifecycle API", date: "", url: "https://developer.chrome.com/docs/web-platform/page-lifecycle-api", citations: ["lifecycle-freeze"] },
  { publisher: "MDN Web Docs", title: "beforeunload event", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event", citations: ["lifecycle-unload"] },
];

export const appPermissionSources = [
  { publisher: "Android Developers", title: "Request runtime permissions", date: "", url: "https://developer.android.com/training/permissions/requesting", citations: ["permission-android", "permission-denied"] },
  { publisher: "Apple Developer", title: "Protecting the user's privacy", date: "", url: "https://developer.apple.com/documentation/uikit/protecting-the-user-s-privacy", citations: ["permission-apple"] },
  { publisher: "MDN Web Docs", title: "Permissions API", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API", citations: ["permission-state"] },
  { publisher: "MDN Web Docs", title: "MediaDevices.getUserMedia()", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia", citations: ["permission-media"] },
  { publisher: "web.dev", title: "Permissions best practices", date: "", url: "https://web.dev/articles/permissions-best-practices", citations: ["permission-timing"] },
];

export const pushNotificationSources = [
  { publisher: "Firebase", title: "FCM architecture", date: "", url: "https://firebase.google.com/docs/cloud-messaging/fcm-architecture", citations: ["push-route"] },
  { publisher: "Firebase", title: "Manage registration tokens", date: "", url: "https://firebase.google.com/docs/cloud-messaging/manage-tokens", citations: ["push-token", "push-invalid"] },
  { publisher: "Android Developers", title: "Notification runtime permission", date: "", url: "https://developer.android.com/develop/ui/views/notifications/notification-permission", citations: ["push-android"] },
  { publisher: "Apple Developer", title: "UserNotifications", date: "", url: "https://developer.apple.com/documentation/usernotifications", citations: ["push-apple"] },
  { publisher: "Apple Developer", title: "Setting up a remote notification server", date: "", url: "https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server", citations: ["push-server"] },
];

export const crossPlatformSources = [
  { publisher: "Flutter", title: "Architectural overview", date: "", url: "https://docs.flutter.dev/resources/architectural-overview", citations: ["cross-core"] },
  { publisher: "Flutter", title: "Platform channels", date: "", url: "https://docs.flutter.dev/platform-integration/platform-channels", citations: ["cross-channel"] },
  { publisher: "React Native", title: "Architecture overview", date: "", url: "https://reactnative.dev/architecture/overview", citations: ["cross-runtime"] },
  { publisher: "Kotlin", title: "Kotlin Multiplatform", date: "", url: "https://kotlinlang.org/docs/multiplatform.html", citations: ["cross-kmp"] },
  { publisher: "Microsoft", title: "What is .NET MAUI?", date: "", url: "https://learn.microsoft.com/en-us/dotnet/maui/what-is-maui?view=net-maui-9.0", citations: ["cross-maui"] },
];

export const webviewSources = [
  { publisher: "Android Developers", title: "Build web apps in WebView", date: "", url: "https://developer.android.com/develop/ui/views/layout/webapps/webview", citations: ["webview-host"] },
  { publisher: "Android Developers", title: "Insecure WebView native bridges", date: "", url: "https://developer.android.com/privacy-and-security/risks/insecure-webview-native-bridges", citations: ["webview-bridge"] },
  { publisher: "Apple Developer", title: "WKWebView", date: "", url: "https://developer.apple.com/documentation/webkit/wkwebview", citations: ["webview-engine"] },
  { publisher: "Apple Developer", title: "WKScriptMessageHandler", date: "", url: "https://developer.apple.com/documentation/webkit/wkscriptmessagehandler", citations: ["webview-message"] },
  { publisher: "MDN Web Docs", title: "Window.postMessage()", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage", citations: ["webview-origin"] },
];

export const cssSelectorSources = [
  { publisher: "W3C", title: "Selectors Level 4", date: "", url: "https://www.w3.org/TR/selectors-4/", citations: ["selector-match"] },
  { publisher: "MDN Web Docs", title: "CSS selectors", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors", citations: ["selector-kinds"] },
  { publisher: "MDN Web Docs", title: "Specificity", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity", citations: ["selector-specificity"] },
  { publisher: "W3C", title: "CSS Cascading and Inheritance Level 6", date: "", url: "https://www.w3.org/TR/css-cascade-6/", citations: ["selector-cascade"] },
  { publisher: "MDN Web Docs", title: "Child combinator", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator", citations: ["selector-child"] },
];

export const boxModelSources = [
  { publisher: "W3C", title: "CSS Box Model Module Level 4", date: "", url: "https://www.w3.org/TR/css-box-4/", citations: ["box-areas"] },
  { publisher: "MDN Web Docs", title: "Introduction to the CSS box model", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Introduction_to_the_CSS_box_model", citations: ["box-definition", "box-margin"] },
  { publisher: "W3C", title: "CSS Sizing Module Level 3", date: "", url: "https://www.w3.org/TR/css-sizing-3/", citations: ["box-sizing"] },
  { publisher: "MDN Web Docs", title: "box-sizing", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing", citations: ["box-border"] },
  { publisher: "MDN Web Docs", title: "width", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/width", citations: ["box-width"] },
];
