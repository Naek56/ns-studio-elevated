/**
 * Le fond de toute l'expérience : la photo, telle quelle, fixe derrière
 * tout le contenu. Remplacer la photo = changer la seule URL ci-dessous
 * (déposer le fichier dans /public et pointer dessus, ex. /background.jpg).
 */
const PHOTO_URL = "/background.svg";

export default function PaperBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 bg-black"
      style={{
        backgroundImage: `url("${PHOTO_URL}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
