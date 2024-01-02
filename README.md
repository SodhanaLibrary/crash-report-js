# crash-report-js
Tracks User's actions, logs and API calls in frontend applications and then create crash report
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





