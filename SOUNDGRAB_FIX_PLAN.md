# SoundGrab MVP Fix Plan

## Issues Identified

Based on code review and requirements, the following issues need to be fixed:

1. **API Integration Issues**:
   - YouTube and Genius APIs are not properly connected (currently using mock data)
   - Search functionality needs to work with real data

2. **Download Functionality Issues**:
   - Download buttons don't properly download payload if not already on computer
   - Current implementation may have issues with the download mechanism

3. **UI Issues**:
   - "Ugly whitebox" in Active Downloads section needs to be removed
   - Text visibility issues in the lyrics search page

4. **Settings Page Issues**:
   - Settings page functionality may not be working properly

5. **MP3 Playback Issues**:
   - MP3 files cannot be played on the site

## Implementation Plan

### 1. Fix API Integration

#### Tasks:
- Update `client/src/services/apiService.ts` to use real API calls instead of mock data
- Set `USE_MOCK_DATA = false` to enable real API connections
- Ensure proper error handling for API failures
- Test search functionality with both YouTube and Genius APIs

### 2. Fix Download Functionality

#### Tasks:
- Update `client/src/lib/downloadUtils.ts` to ensure downloads work properly
- Fix the download button implementation to properly trigger downloads
- Ensure downloaded files are saved correctly on the user's computer
- Implement proper error handling and user feedback during downloads

### 3. Improve UI

#### Tasks:
- Remove or redesign the "ugly whitebox" in the Active Downloads section
- Update `client/src/components/DownloadSection.tsx` to improve UI
- Fix text visibility issues in the lyrics search page
- Ensure proper contrast and readability for all text elements

### 4. Fix Settings Page

#### Tasks:
- Update `client/src/pages/settings.tsx` to ensure all settings work properly
- Implement proper settings persistence (localStorage or API)
- Ensure settings changes are applied correctly throughout the application

### 5. Fix MP3 Playback

#### Tasks:
- Update `client/src/components/PlayerBar.tsx` to fix MP3 playback issues
- Update `client/src/components/ui/audio-player.tsx` to ensure proper audio handling
- Test MP3 playback with various audio sources
- Implement proper error handling for audio playback failures