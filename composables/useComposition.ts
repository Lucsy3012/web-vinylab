import { useSelected } from "@/stores/selected";
import { Song } from "~/types/globalTypes";

export function useComposition() {
  const supabase = useSupabaseClient();

  function getSongs(selected: any) {
    return selected?.side?.fields?.songs as Song[];
  }

  function getFileName(selected: any) {
    const albumSlug = selected?.album?.fields?.slug;
    const sideSongsId = getSongs(selected).map((song) => {
      return song.sys.id;
    });
    return `${albumSlug}-${sideSongsId.join("-")}.mp3`;
  }

  async function getStoredFile(selected: any) {
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
