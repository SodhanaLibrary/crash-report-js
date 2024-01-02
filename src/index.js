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

const handleMouseEvent = (type, limit) => event => {
  const tracks = JSON.parse(
    sessionStorage.getItem('crash_report_tracks') || '[]'
  );
  const target = generateXPathWithNearestParentId(event.target);
  const track = {
    id: tracks[tracks.length - 1].id + 1,
    type,
    target,
    time: new Date(),
  };
  if(tracks.length > limit + 1) {
    tracks.shift();
  }
  tracks.push(track);
  sessionStorage.setItem('crash_report_tracks', JSON.stringify(tracks));
};

const addTrack = track => {
  const tracks = JSON.parse(
    sessionStorage.getItem('crash_report_tracks') || '[]'
  );
  track.id = tracks[tracks.length - 1].id + 1;
  track.time = new Date();
  tracks.push(track);
  sessionStorage.setItem('crash_report_tracks', JSON.stringify(tracks));
};

const handleChange = limit => event => {
  const tracks = JSON.parse(
    sessionStorage.getItem('crash_report_tracks') || '[]'
  );
  const prevCommand =
    tracks && tracks.length ? tracks[tracks.length - 1] : null;
  const target = generateXPathWithNearestParentId(event.target);
  const track = {
    id: tracks[tracks.length - 1].id + 1,
    type: 'change',
    target,
    value: event.target.value,
    time: new Date(),
  };
  if(tracks.length > limit + 1) {
    tracks.shift();
  }
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

const handleDocumentLoad = limit => () => {
  let oldHref = document.location.href;
  const body = document.querySelector('body');
  const observer = new MutationObserver(mutations => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      const tracks = JSON.parse(
        sessionStorage.getItem('crash_report_tracks') || '[]'
      );
      const track = {
        id: tracks[tracks.length - 1].id + 1,
        type: 'url',
        value: oldHref,
        time: new Date(),
      };
      if(tracks.length > limit + 1) {
        tracks.shift();
      }
      tracks.push(track);
      sessionStorage.setItem('crash_report_tracks', JSON.stringify(tracks));
    }
  });
  observer.observe(body, { childList: true, subtree: true });
};

const clearTracks = () => {
  sessionStorage.removeItem('crash_report_tracks');
};

const getAllTracks = () => {
  return JSON.parse(
    sessionStorage.getItem('crash_report_tracks') || '[]'
  );
};

const initTracks = (initInfo = {events: ['click', 'change', 'url', 'dblclick', 'contextmenu'], limit: 100}) => {
  const {events, limit} = initInfo;
  const mouseEvents = {
      click: handleMouseEvent('click', limit),
      contextmenu: handleMouseEvent('contextmenu', limit),
      dblclick: handleMouseEvent('dblclick', limit),
      mousedown: handleMouseEvent('mousedown', limit),
      mouseenter: handleMouseEvent('mouseenter', limit),
      mouseleave: handleMouseEvent('mouseleave', limit),
      mousemove: handleMouseEvent('mousemove', limit),
      mouseout: handleMouseEvent('mouseout', limit),
      mouseover: handleMouseEvent('mouseover', limit),
      mouseup: handleMouseEvent('mouseup', limit),
    };
    events.forEach(e => {
      if(e === 'url') {
        window.onload = handleDocumentLoad(limit);
      } else if (e === 'change') {
        document.addEventListener('input', handleChange(limit));
      } else {
        document.addEventListener(e, mouseEvents[e]);
      }
    });
};

export { initTracks, addTrack, getAllTracks, clearTracks };
