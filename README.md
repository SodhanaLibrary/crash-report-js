# crash-report-js
Tracks User's actions, logs and API calls in frontend applications and then create crash report
# Usage and example
Here i have documented the purpose and React example application
http://blog.sodhanalibrary.com/2024/01/track-user-actions-and-errors-using.html
# Install
```
npm install crash-report-js
```
# Import
```
import { initTracks, addTrack, getAllTracks, clearTracks } from crash-report-js
```
# Initiate tracks
```
initTracks();
```
# Clear tracks
```
clearTracks();
```
# Add track
```
addTrack({
  type: 'log',
  target: 'error',
  value: 'error message here'
});
```
# Get all tracks
```
getAllTracks()
```
# Chrome extension (crash-report-js)
https://chromewebstore.google.com/detail/crash-report-js-extension/pacgfjjelhfpalaoniejckhjpkibonib




