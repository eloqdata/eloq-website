// modules/jumpToFragment.js

export function onRouteDidUpdate({location}) {
  if (location.hash) {
    setTimeout(() => {
      const id = decodeURIComponent(location.hash.substring(1));
      const element = document.getElementById(id);
      if (element) {
        // Scroll to the element with smooth behavior
        element.scrollIntoView({behavior: 'smooth'});
      }
    }, 0);
  }
}
