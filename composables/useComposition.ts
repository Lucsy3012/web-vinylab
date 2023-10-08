import { useSelected } from "@/stores/selected";
import { Song } from "~/types/globalTypes";
const supabase = useSupabaseClient();

export function useComposition() {
  function getSongs(selected) {
    return selected?.side?.fields?.songs as Song[];
  }

  function getFileName(selected) {
    const albumSlug = selected?.album?.fields?.slug;
    const sideSongsId = getSongs(selected).map((song) => {
      return song.sys.id;
    });
    return `${albumSlug}-${sideSongsId.join("-")}.mp3`;
  }

  async function getStoredFile(selected) {
    const filename = getFileName(selected);
    const supabaseUrl =
      "https://ukdjuwjtiyxzfxecogan.supabase.co/storage/v1/object/public/Composed%20Songs/";
    const checkComposedSongUrl = await supabase.storage
      .from("Composed Songs")
      .list("", {
        limit: 1,
        search: getFileName(selected),
      })
      .then(function (res: any) {
        return !!res?.data?.[0]?.name ?? false;
      })
      .catch((error) => {
        throw new Error(error);
      });

    return checkComposedSongUrl ? supabaseUrl + filename : false;
  }

  return {
    getSongs,
    getFileName,
    getStoredFile,
  };
}
