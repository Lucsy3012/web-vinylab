<script setup lang="ts">
import { useCollection } from "@/stores/collection";
import { useArtists } from "@/stores/artists";
import { useSelected } from "@/stores/selected";
import { useSettings } from "@/stores/settings";

import { Album, AlbumByArtist, Artist } from "~~/types/globalTypes";
import DisplayController from "~/components/DisplayController.vue";

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

    // Add custom value for easier filtering
    albums.map((album: Album) => {
      let albumArtists: string[] = [];

      album.fields.artists.forEach((artist: Artist) => {
        albumArtists.push(artist.fields.artistName.toString());
      });

      const artists = albumArtists.join(", ");

      album.fields.filterValue = `${artists} ${album.fields.title}`;
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

// Coverflow specific
const coverflowCount = ref(0);

// Filter
const filter = useFilter();
const filteredAlbumsByArtist = ref(collection.sortedByArtists);
const filteredAlbums = ref(filteredAlbumsByArtist.value);

watch(
  () => settings.filter,
  () => {
    // Return filtered albums by artists
    filteredAlbumsByArtist.value = filter.filterNameAndArtist(
      collection.sortedByArtists,
      settings.filter,
    );

    // Return filtered albums without artists
    filteredAlbums.value = filteredAlbumsByArtist.value
      .map((artist: AlbumByArtist) => {
        return artist.albums;
      })
      .flat();
  },
);
</script>

<template>
  <div>
    <section>
      <div class="stretch">
        <div class="row align-items--center">
          <div class="col col-6">
            <FilterBar />
          </div>
          <div class="col col-6">
            <DisplayController />
          </div>
        </div>
      </div>
    </section>

    <!-- Display Mode: Grid and List -->
    <section v-if="settings.display !== 'coverflow'">
      <div class="stretch">
        <div class="row">
          <div class="col col-12">
            <div
              class="artist-list"
              :class="`artist-list--${settings.display}`"
            >
              <!-- Each artist -->
              <div
                class="artist-collection"
                v-for="artist in filteredAlbumsByArtist as AlbumByArtist[]"
                :key="artist.sys.id"
              >
                <!-- Artist avatar -->
                <CollectionTitle
                  :name="artist.fields.artistName as string"
                  :avatar="artist.fields.avatar"
                  :records="artist?.albums?.length"
                />

                <!-- Albums -->
                <div
                  v-if="artist.albums.length > 0"
                  class="mt6 mt7-m album-controller"
                  :class="`album-controller--${settings.display}`"
                >
                  <AlbumItem
                    v-for="album in artist.albums as Album[]"
                    :album="album"
                    @click="selectAlbum(album)"
                    :key="album.sys.id"
                    :class="{
                      selected: album.sys.id === selected?.album?.sys?.id,
                    }"
                  />
                </div>

                <!-- No Albums -->
                <div
                  v-else
                  class="mt6 mt7-m"
                  :class="`no-album-notice--${settings.display}`"
                >
                  <p
                    class="no-album-notice title-4 --site-color-75 text--center"
                  >
                    {{ t("collections.noAlbums") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Display Mode: Coverflow -->
    <section class="coverflow" v-if="settings.display === 'coverflow'">
      <div class="stretch">
        <div class="row">
          <div class="col col-12">
            <div class="album-controller album-controller--coverflow">
              <!-- Albums -->
              <AlbumItem
                v-for="(album, index) in filteredAlbums as Album[]"
                :album="album"
                @click="coverflowCount = index"
                @dblclick="selectAlbum(album)"
                :key="album.sys.id"
                :class="{
                  selected: album.sys.id === selected?.album?.sys?.id,
                  'coverflow-2': index === coverflowCount - 2,
                  'coverflow-1': index === coverflowCount - 1,
                  'coverflow-active': index === coverflowCount,
                  'coverflow+1': index === coverflowCount + 1,
                  'coverflow+2': index === coverflowCount + 2,
                }"
              />
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

    <!-- Experience Mode -->
    <section
      id="experience-mode"
      :class="{ active: settings.mode === 'experience' }"
    >
      <ClientOnly>
        <ExperienceMediaPlayer
          v-if="selected.side?.sys?.id && settings.mode === 'experience'"
          :key="`${selected.side?.sys?.id}-experience` ?? 'default'"
        />
      </ClientOnly>
      <h2 v-if="!selected.side?.sys?.id" class="title-1 --site-accent">
        {{ $t("experience.noAlbumSelected") }}
      </h2>
      <img
        v-if="selected?.album"
        class="background-image"
        :src="selected.album.fields?.albumCoverFront?.fields?.file?.url"
        :alt="selected.album.fields?.albumCoverFront?.fields?.title"
      />
    </section>
  </div>
</template>

<style lang="less" scoped>
@import (reference) "../assets/less/variables.less";
@import (reference) "../assets/less/shorthands.less";

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

  &.album-controller--list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &.album-controller--coverflow {
    display: grid;
    overflow-x: hidden;
    grid-template-columns: 350px;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
}

.no-album-notice {
  background-color: var(--site-contrast-33);
  padding: 3em 2em;
  .--rounded-l();
}

#experience-mode {
  --transition-duration: 1s;
  --transition-timing-function: var(--bezier-slow-in-fast-out);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  display: grid;
  place-items: center;
  opacity: 0;
  background-color: var(--btn-background-color);
  z-index: 11;
  contain: layout;
  .transit();

  &.active {
    pointer-events: all;
    opacity: 1;
  }

  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    filter: blur(5px);
    opacity: 0.025;
    z-index: -1;
  }
}
</style>
