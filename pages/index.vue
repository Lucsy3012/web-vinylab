<script setup lang="ts">
import { useCollection } from "@/stores/collection";
import { useArtists } from "@/stores/artists";
import { useSelected } from "@/stores/selected";
import { useSettings } from "@/stores/settings";

import { Album, AlbumByArtist, Artist } from "~~/types/globalTypes";

// Locales
const localePath = useLocalePath();
const { t, locale } = useI18n();

// Contentful
const { getEntries } = useContentful();

const collection = useCollection();
const artists = useArtists();

// Calls
const albums = await useAsyncData("content", async () => {
  // Use stored data
  if (await collection.check()) {
    return unref(collection.data);
  }

  // Call albums from Contentful
  const entries = await getEntries({
    content_type: "album",
    order: ["fields.releaseDate"],
    limit: 1000,
    locale: unref(locale),
  });

  const getArtists = await getEntries({
    content_type: "artist",
    order: ["fields.artistName"],
    limit: 1000,
    locale: unref(locale),
  });

  // Align artists data with albums into new array
  const sortedData = getArtists.items.map((artist) => {
    const albums = entries.items.filter((album) => {
      const albumArtists = album.fields.artists as any;
      return albumArtists.some(
        (albumArtist: Artist) => albumArtist.sys.id === artist.sys.id,
      );
    });

    return {
      ...artist,
      albums,
    };
  });

  // Store data
  await collection.set(entries);
  await collection.setSortedByArtists(sortedData);
  await artists.set(getArtists);

  return entries;
});

// Global settings
const settings = useSettings();

// Selecting album
const selected = useSelected();
function selectAlbum(album: Album) {
  selected.setAlbum(album);
}
</script>

<template>
  <div>
    <section>
      <div class="stretch">
        <div class="row">
          <div class="col col-12">
            <!-- Display: Grid -->
            <div class="artist-list">
              <div class="artist-collection">
                <CollectionTitle
                  v-for="artist in collection.sortedByArtists as AlbumByArtist[]"
                  :name="artist.fields.artistName as string"
                  :avatar="artist.fields.avatar"
                  :records="artist?.albums?.length"
                  :key="artist.sys.id"
                />
                <div
                  class="mt6 mt7-m album-controller"
                  :class="`album-controller--${settings.display}`"
                >
                  <AlbumItem
                    v-for="album in albums.data.value.items as Album[]"
                    :album="album"
                    @click="selectAlbum(album)"
                    :key="album.sys.id"
                    :class="{
                      selected: album.sys.id === selected?.album?.sys?.id,
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Media Player -->
    <ClientOnly>
      <MediaPlayer
        v-if="selected.side?.sys?.id"
        :key="selected.side?.sys?.id ?? 'default'"
      />
    </ClientOnly>
  </div>
</template>

<style lang="less" scoped>
.artist-list {
  display: flex;
  flex-direction: column;
  gap: 3.5em;

  .artist-collection {
    padding: 2em 0;
  }
}

.album-controller {
  li.selected {
    font-weight: bold;
    color: var(--site-color);
  }

  // Display types
  &.album-controller--grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2em;
  }
}
</style>
