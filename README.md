# Use cases (Pages and features)
- Home (logged out)
  - Authentication form

- Home (logged in)
  - List of rooms


- Room
  - Video player
  - Room settings
    - Public room
    - Private room
      - Password
    - Change room's name (when changing room's name, slug should be regenerated)
    - Room permission for mods
    - Limit maximum duration for each video in the queue
  

- User profile
  - Change name
  - Change avatar
  - Current authentication providers
  - My rooms
  - My Playlists
  - Logout


- Room Video player
  - Add videos from users playlists to room's queue
  - Search youtube video by:
    - Video URL
    - Video Name
  - Search Spotify music by:
    - Song Url
    - Song Name
  - Song queue



# Entities

### user
- uid
- name
- username
- avatarUrl
- createdAt
- providerCredentials
- playlists

### room
- uid
- slug
- name
- creator
- queue
- createdAt
- updatedAt
- voteSkipCount
- maxVideoDuration
- currentUsers
- isPrivate
- password

### queue
- uid
- videos
  
### playlist
- uid
- owner
- videos
  
### video
- uid
- url
- duration
- startedPlayingAt
- likes
