export const NO_PHOTO_SRC = import.meta.env.BASE_URL + 'no-photo.png';
export const avatarSrc = (photoUrl?: string) => photoUrl || NO_PHOTO_SRC;
