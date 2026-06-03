// src/utils/validation.js

export const TITLE_REGEX = /^[A-Za-z0-9 ]{3,255}$/;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5 MB
export const MAX_AUDIO_SIZE = 20 * 1024 * 1024;  // 20 MB

export function validatePodcastForm(fields, isEdit = false) {
  const errors = {};

  if (!fields.title || !TITLE_REGEX.test(fields.title.trim())) {
    errors.title =
      'Title is required, must be 3–255 characters, and contain only letters, numbers, and spaces.';
  }

  if (!fields.description || fields.description.trim().length < 20) {
    errors.description = 'Description is required and must be at least 20 characters.';
  }

  if (!isEdit) {
    if (!fields.thumbnail) {
      errors.thumbnail = 'Thumbnail image is required.';
    } else {
      if (!ALLOWED_IMAGE_TYPES.includes(fields.thumbnail.type)) {
        errors.thumbnail = 'Thumbnail must be JPG, PNG, or WEBP.';
      } else if (fields.thumbnail.size > MAX_IMAGE_SIZE) {
        errors.thumbnail = 'Thumbnail must be under 5 MB.';
      }
    }

    if (!fields.audio_file) {
      errors.audio_file = 'Audio file is required.';
    } else {
      if (!ALLOWED_AUDIO_TYPES.includes(fields.audio_file.type)) {
        errors.audio_file = 'Audio file must be MP3 format.';
      } else if (fields.audio_file.size > MAX_AUDIO_SIZE) {
        errors.audio_file = 'Audio file must be under 20 MB.';
      }
    }
  } else {
    // On edit, file fields are optional — but validate if provided
    if (fields.thumbnail) {
      if (!ALLOWED_IMAGE_TYPES.includes(fields.thumbnail.type)) {
        errors.thumbnail = 'Thumbnail must be JPG, PNG, or WEBP.';
      } else if (fields.thumbnail.size > MAX_IMAGE_SIZE) {
        errors.thumbnail = 'Thumbnail must be under 5 MB.';
      }
    }
    if (fields.audio_file) {
      if (!ALLOWED_AUDIO_TYPES.includes(fields.audio_file.type)) {
        errors.audio_file = 'Audio file must be MP3 format.';
      } else if (fields.audio_file.size > MAX_AUDIO_SIZE) {
        errors.audio_file = 'Audio file must be under 20 MB.';
      }
    }
  }

  return errors;
}
