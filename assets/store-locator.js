!(function () {
  const e = JSON.parse(
    document
      .querySelector("[data-store-locator-options]")
      .getAttribute("data-store-locator-options"),
  );
  if (
    ((mapboxgl.accessToken = atob(e.accessToken)),
    document.addEventListener("shopify:section:load", (e) => {
      if (![...e.target.classList].includes("main-store-locator")) return;
      const t = document.querySelector("[id^=store-locator-js]");
      if (t && t) {
        const e = document.createElement("script");
        (e.src = t.src), t.parentNode.replaceChild(e, t);
      }
    }),
    "not4s" == mapboxgl.accessToken)
  )
    return;
  const t = JSON.parse(
      document.getElementById(`stores-json${e.sid}`).textContent,
    ),
    o = new mapboxgl.Map({
      container: `map${e.sid}`,
      style: {
        streets: "mapbox://styles/mapbox/streets-v12",
        outdoors: "mapbox://styles/mapbox/outdoors-v12",
        light: "mapbox://styles/mapbox/light-v11",
        dark: "mapbox://styles/mapbox/dark-v11",
        satellite_streets: "mapbox://styles/mapbox/satellite-streets-v12",
      }[e.style],
      center: t.features[0].geometry.coordinates,
      zoom: e.zoom,
      scrollZoom: e.scrollZoom,
      attributionControl: !1,
      pitch: e.pitch,
      bearing: e.bearing,
    });
  if ((o.addControl(new mapboxgl.NavigationControl()), e.enableSearchBox)) {
    const e = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: !0,
      render: function (e) {
        var t = e.place_name.split(",");
        return (
          '<div class="mapboxgl-ctrl-geocoder--suggestion"><div class="mapboxgl-ctrl-geocoder--suggestion-title needsclick">' +
          t[0] +
          '</div><div class="mapboxgl-ctrl-geocoder--suggestion-address needsclick">' +
          t.splice(1, t.length).join(",") +
          "</div></div>"
        );
      },
    });
    o.addControl(e, "top-left");
  }
  t.features.forEach((e, t) => {
    e.properties.id = t;
  }),
    o.on("idle", () => {
      o.setFog({}), o.resize();
    }),
    o.on("load", () => {
      o.addSource("places", {
        type: "geojson",
        data: t,
      }),
        (function (t) {
          const o = document.getElementById(`listings${e.sid}`);
          o.innerHTML = "";
          for (const e of t.features) {
            const s = o.appendChild(document.createElement("div")),
              { name: r, content: c } = e.properties;
            (s.id = `listing-${e.properties.id}`),
              (s.className = "store-locator__item");
            const i = s.appendChild(document.createElement("a"));
            (i.href = "#"),
              (i.className = "store-locator__title needsclick"),
              (i.id = `link-${e.properties.id}`),
              (i.innerHTML = `${r}`);
            const l = s.appendChild(document.createElement("div"));
            (l.className = "rte"),
              (l.innerHTML = c),
              s.addEventListener("click", function (e) {
                e.preventDefault();
                for (const e of t.features)
                  this.id === `listing-${e.properties.id}` && (n(e), a(e));
                const s = o.getElementsByClassName("is--active");
                s[0] && s[0].classList.remove("is--active"),
                  this.classList.add("is--active");
              });
          }
        })(t),
        (function () {
          for (const e of t.features) {
            const t = document.createElement("div");
            (t.id = `marker-${e.properties.id}`),
              (t.className = "store-locator__marker"),
              s ||
                (t.innerHTML =
                  '<svg class="icon icon--store-locator" aria-hidden="true" focusable="false" role="presentation"><use href="#icon--store-locator-marker"></use></svg>'),
              new mapboxgl.Marker(t, {
                offset: [0, -23],
              })
                .setLngLat(e.geometry.coordinates)
                .addTo(o),
              t.addEventListener("click", (t) => {
                n(e), a(e);
                const o = document.getElementsByClassName("is--active");
                t.stopPropagation(),
                  o[0] && o[0].classList.remove("is--active");
                const s = document.getElementById(`listing-${e.properties.id}`);
                s.classList.add("is--active");
              });
          }
        })();
    });
  const s = e.isImgMarker;
  function n(e) {
    o.flyTo({
      center: e.geometry.coordinates,
      zoom: 15,
    });
  }
  function a(e) {
    const t = document.getElementsByClassName("mapboxgl-popup");
    t[0] && t[0].remove();
    const { name: s, content: n } = e.properties,
      a = new mapboxgl.Popup({
        closeOnClick: !1,
      })
        .setLngLat(e.geometry.coordinates)
        .setHTML(`<h3>${s}</h3>${n}`)
        .addTo(o);
    a._container
      .querySelector(".mapboxgl-popup-content p")
      .classList.add("rte"),
      window.width < 768 &&
        setTimeout(() => {
          a._container.scrollIntoView({
            block: "end",
            behavior: "smooth",
          });
        }, 100);
  }
})();

(() => {
  const optionsElement = document.querySelector("[data-store-locator-options]");
  const storeLocatorOptions = JSON.parse(
    optionsElement.getAttribute("data-store-locator-options"),
  );

  mapboxgl.accessToken = atob(storeLocatorOptions.accessToken);

  document.addEventListener("shopify:section:load", (event) => {
    if (![...event.target.classList].includes("main-store-locator")) return;

    const scriptElement = document.querySelector("[id^=store-locator-js]");
    if (scriptElement) {
      const newScript = document.createElement("script");
      newScript.src = scriptElement.src;
      scriptElement.parentNode.replaceChild(newScript, scriptElement);
    }
  });

  if (mapboxgl.accessToken === "not4s") return;

  const storeData = JSON.parse(
    document.getElementById(`stores-json${storeLocatorOptions.sid}`)
      .textContent,
  );
  const map = new mapboxgl.Map({
    container: `map${storeLocatorOptions.sid}`,
    style: {
      streets: "mapbox://styles/mapbox/streets-v12",
      outdoors: "mapbox://styles/mapbox/outdoors-v12",
      light: "mapbox://styles/mapbox/light-v11",
      dark: "mapbox://styles/mapbox/dark-v11",
      satellite_streets: "mapbox://styles/mapbox/satellite-streets-v12",
    }[storeLocatorOptions.style],
    center: storeData.features[0].geometry.coordinates,
    zoom: storeLocatorOptions.zoom,
    scrollZoom: storeLocatorOptions.scrollZoom,
    attributionControl: false,
    pitch: storeLocatorOptions.pitch,
    bearing: storeLocatorOptions.bearing,
  });

  map.addControl(new mapboxgl.NavigationControl());

  if (storeLocatorOptions.enableSearchBox) {
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: true,
      render: ({ place_name }) => {
        const parts = place_name.split(",");
        return `
          <div class="mapboxgl-ctrl-geocoder--suggestion">
            <div class="mapboxgl-ctrl-geocoder--suggestion-title needsclick">${parts[0]}</div>
            <div class="mapboxgl-ctrl-geocoder--suggestion-address needsclick">${parts.slice(1).join(",")}</div>
          </div>`;
      },
    });

    map.addControl(geocoder, "top-left");
  }

  storeData.features.forEach((feature, index) => {
    feature.properties.id = index;
  });

  map.on("idle", () => {
    map.setFog({});
    map.resize();
  });

  map.on("load", () => {
    map.addSource("places", {
      type: "geojson",
      data: storeData,
    });

    const renderListings = (data) => {
      const listingsContainer = document.getElementById(
        `listings${storeLocatorOptions.sid}`,
      );
      listingsContainer.innerHTML = "";

      data.features.forEach((feature) => {
        const { id, name, content } = feature.properties;

        const listingElement = document.createElement("div");
        listingElement.id = `listing-${id}`;
        listingElement.className = "store-locator__item";

        const linkElement = document.createElement("a");
        linkElement.href = "#";
        linkElement.className = "store-locator__title needsclick";
        linkElement.id = `link-${id}`;
        linkElement.innerHTML = name;

        const contentElement = document.createElement("div");
        contentElement.className = "rte";
        contentElement.innerHTML = content;

        listingElement.appendChild(linkElement);
        listingElement.appendChild(contentElement);

        listingElement.addEventListener("click", (event) => {
          event.preventDefault();
          flyToFeature(feature);
          highlightListing(feature);
        });

        listingsContainer.appendChild(listingElement);
      });
    };

    const addMarkers = () => {
      storeData.features.forEach((feature) => {
        const { id, coordinates } = feature.geometry;
        const markerElement = document.createElement("div");
        markerElement.id = `marker-${id}`;
        markerElement.className = "store-locator__marker";

        if (!storeLocatorOptions.isImgMarker) {
          markerElement.innerHTML = `
            <svg class="icon icon--store-locator" aria-hidden="true" focusable="false" role="presentation">
              <use href="#icon--store-locator-marker"></use>
            </svg>`;
        }

        new mapboxgl.Marker(markerElement, { offset: [0, -23] })
          .setLngLat(coordinates)
          .addTo(map);

        markerElement.addEventListener("click", (event) => {
          event.stopPropagation();
          flyToFeature(feature);
          highlightListing(feature);
        });
      });
    };

    renderListings(storeData);
    addMarkers();
  });

  const flyToFeature = (feature) => {
    map.flyTo({
      center: feature.geometry.coordinates,
      zoom: 15,
    });
  };

  const highlightListing = (feature) => {
    const activeListings = document.getElementsByClassName("is--active");
    if (activeListings[0]) activeListings[0].classList.remove("is--active");

    const listingElement = document.getElementById(
      `listing-${feature.properties.id}`,
    );
    listingElement.classList.add("is--active");

    const popupElement = document.getElementsByClassName("mapboxgl-popup");
    if (popupElement[0]) popupElement[0].remove();

    const popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(feature.geometry.coordinates)
      .setHTML(
        `<h3>${feature.properties.name}</h3>${feature.properties.content}`,
      )
      .addTo(map);

    const popupContent = popup._container.querySelector(
      ".mapboxgl-popup-content p",
    );
    if (popupContent) popupContent.classList.add("rte");

    if (window.width < 768) {
      setTimeout(() => {
        popup._container.scrollIntoView({ block: "end", behavior: "smooth" });
      }, 100);
    }
  };
})();
