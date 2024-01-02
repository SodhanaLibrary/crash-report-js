const generateXPathWithNearestParentId = (element) => {
    let path = '';
    let nearestParentId = null;

    // Check if the current element's has an ID
    if (element.id) {
        nearestParentId = element.id;
    }

    while (!nearestParentId && element !== document.body && element) {
        const tagName = element.tagName.toLowerCase();
        let index = 1;
        let sibling = element.previousElementSibling;

        while (sibling) {
            if (sibling.tagName.toLowerCase() === tagName) {
                index += 1;
            }
            sibling = sibling.previousElementSibling;
        }

        if (index === 1) {
            path = `/${tagName}${path}`;
        } else {
            path = `/${tagName}[${index}]${path}`;
        }

        // Check if the current element's parent has an ID
        if (element.parentElement && element.parentElement.id) {
            nearestParentId = element.parentElement.id;
            break; // Stop searching when we find the nearest parent with an ID
        }

        element = element.parentElement;
    }

    if (nearestParentId) {
        path = `//*[@id='${nearestParentId}']${path}`;
        return path;
    }
    return null; // No parent with an ID found
};

const handleMouseEvent = type => event => {
  const tracks = JSON.parse(
    sessionStorage.getItem('crash_report_tracks') || '[]'
  );
  const target = generateXPathWithNearestParentId(event.target);
  const track = {
    id: tracks.length + 1,
    type,
    target,
    time: new Date(),
  };
  tracks.push(track);
  sessionStorage.setItem('crash_report_tracks', JSON.stringify(tracks));
};

const addTrack = track => {
  const tracks = JSON.parse(
    sessionStorage.getItem('crash_report_tracks') || '[]'
  );
  track.id = tracks.length + 1;
  track.time = new Date();
  tracks.push(track);
  sessionStorage.setItem('crash_report_tracks', JSON.stringify(tracks));
};

const handleChange = event => {
  const tracks = JSON.parse(
    sessionStorage.getItem('crash_report_tracks') || '[]'
  );
  const prevCommand =
    tracks && tracks.length ? tracks[tracks.length - 1] : null;
  const target = generateXPathWithNearestParentId(event.target);
  const track = {
    id: tracks.length + 1,
    type: 'change',
    target,
    value: event.target.value,
    time: new Date(),
  };
  if (
    prevCommand &&
    prevCommand.type === 'change' &&
    prevCommand.target === target
  ) {
    tracks.pop();
  }
  tracks.push(track);
  sessionStorage.setItem('crash_report_tracks', JSON.stringify(tracks));
};

const handleDocumentLoad = () => {
  let oldHref = document.location.href;
  const body = document.querySelector('body');
  const observer = new MutationObserver(mutations => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      const tracks = JSON.parse(
        sessionStorage.getItem('crash_report_tracks') || '[]'
      );
      const track = {
        id: tracks.length + 1,
        type: 'url',
        value: oldHref,
        time: new Date(),
      };
      tracks.push(track);
      sessionStorage.setItem('crash_report_tracks', JSON.stringify(tracks));
    }
  });
  observer.observe(body, { childList: true, subtree: true });
};

const clearTracks = () => {
  sessionStorage.removeItem('crash_report_tracks');
};

const initTracks = (initInfo = {events: ['click', 'change', 'url', 'dblclick', 'contextmenu']}) => {
  const mouseEvents = {
      click: handleMouseEvent('click'),
      contextmenu: handleMouseEvent('contextmenu'),
      dblclick: handleMouseEvent('dblclick'),
      mousedown: handleMouseEvent('mousedown'),
      mouseenter: handleMouseEvent('mouseenter'),
      mouseleave: handleMouseEvent('mouseleave'),
      mousemove: handleMouseEvent('mousemove'),
      mouseout: handleMouseEvent('mouseout'),
      mouseover: handleMouseEvent('mouseover'),
      mouseup: handleMouseEvent('mouseup'),
    };
    const {events} = initInfo;
    events.forEach(e => {
      if(e === 'url') {
        window.onload = handleDocumentLoad;
      } else if (e === 'change') {
        document.addEventListener('input', handleChange);
      } else {
        document.addEventListener(e, mouseEvents[e]);
      }
    });
};

export { initTracks, addTrack, clearTracks };
