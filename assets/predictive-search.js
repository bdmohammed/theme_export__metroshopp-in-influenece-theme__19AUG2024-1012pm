//done
(async ($) => {
  const searchUrl = window.T4Sconfigs.enablePredictiveSearch
    ? window.T4Sroutes.predictive_search_url
    : window.T4Sroutes.search_url;
  const cacheNameFirst = window.T4SThemeSP.cacheNameFirst;
  const isTouchDevice = !!(
    'ontouchstart' in window ||
    (window.DocumentTouch && window.document instanceof DocumentTouch) ||
    window.navigator.maxTouchPoints ||
    window.navigator.msMaxTouchPoints
  );
  const hasSearchTerm = 'has--search-terms';
  const dataKey = 'data-key';
  class PredictiveSearch {
    constructor(container) {
      this.container = container;
      this.$container = $(container);
      this.deferRequestBy = 300;
      this.cachedResults = {};
      this.$form = this.$container.find('[data-frm-search]');
      this.form = this.$form[0];
      this.$input = this.$container.find('[data-input-search]');
      this.input = this.$input[0];
      this.$results = this.$container.find('[data-results-search]');
      this.results = this.$results[0];
      this.$skeleton = this.$container.find('[data-skeleton-search]');
      this.$formListKey = this.$form.find('[data-listkey-search]');
      this.$listSuggest = this.$form.find('[data-listsuggest-search]');
      this.listSuggest = this.$listSuggest[0];
      this.isOpen = false;
      this.sectionID = this.$container.attr('data-sid') || 'predictive-search';
      this.$title = this.$container.find('[data-title-search]');
      this.title = this.$title[0];
      this.$viewAll = this.$container.find('[data-viewAll-search]');
      this.viewAll = this.$viewAll[0];
      this.$select = this.$container.find('[data-cat-search]>select');
      this.select = this.$select[0];
      this.currentVal = this.$select.val() || '*';
      this.hasClassTerms = false;
      this.searchUrlForm = this.$form.serialize();
      this.setupEventListeners();
      this.onClickKey();
    }

    setupEventListeners() {
      this.form.addEventListener('submit', this.onFormSubmit.bind(this));
      if (!this.form.querySelector('[type="submit"]')) {
        this.$form.append('<button type="submit" class="d-none"></button>'),
          this.input.addEventListener(
            'input',
            this.debounce(
              (event) => this.onChange(event),
              this.deferRequestBy
            ).bind(this)
          );
      }
      this.input.addEventListener('focus', this.onFocus.bind(this));

      if (this.select) {
        this.select.addEventListener(
          'change',
          this.onChangeSelectCat.bind(this)
        );
        this.$input.after(
          '<input type="search" data-input-q name="q" value="" class="mini-search__input d-none">'
        );
        this.input.removeAttribute('name');
        this.$input_q = this.$container.find('[data-input-q]');
        this.input.addEventListener('input', () => {
          this.$input_q.val(this.getQuery());
        });
      }

      this.container.addEventListener('focusout', this.onFocusOut.bind(this));
      this.container.addEventListener('keyup', this.onKeyup.bind(this));
      this.container.addEventListener('keydown', this.onKeydown.bind(this));
    }

    debounce(func, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }

    getQuery() {
      let query = this.input.value.trim();
      if (this.select) {
        const category = this.currentVal.trim();
        if (category !== '*') {
          query = `product_type:${category} AND ${query}`;
        }
      }
      return query;
    }

    onChange() {
      const query = this.getQuery();
      if (!query.length) {
        this.close(true);
        if (this.hasClassTerms) {
          this.form.classList.remove(hasSearchTerm);
          this.hasClassTerms = false;
        }
        this.$results.hide();
        this.$viewAll.hide();
        this.$skeletonElement.hide();
        return;
      }
      this.getSearchResults(query);
      if (!this.hasClassTerms) {
        this.form.classList.add(hasSearchTerm);
        this.hasClassTerms = true;
      }
    }

    onFormSubmit(event) {
      const queryLength = this.getQuery().length;
      if (
        !queryLength ||
        (queryLength &&
          this.container.querySelector('[aria-selected="true"] a'))
      ) {
        event.preventDefault();
      }
    }

    onFocus() {
      const query = this.getQuery();
      if (query.length) {
        if (this.container.getAttribute('results') === 'true') {
          this.open();
        } else {
          this.getSearchResults(query);
        }
      }
    }

    onChangeSelectCat() {
      this.currentVal = this.$select.val();
      const query = this.getQuery();
      this.getSearchResults(query);
    }

    onClickKey() {
      let timeoutId;
      this.$container
        .find('[data-listKey]')
        .on('click', `[${dataKey}]`, (event) => {
          event.preventDefault();
          const $key = $(event.currentTarget);
          if (isTouchDevice) {
            this.$input.val($key.attr(dataKey));
          } else {
            this.$input.val($key.attr(dataKey)).focus();
            this.$container.addClass('showing--results');
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              this.$container.removeClass('showing--results');
            }, 1500);
          }
          this.input.dispatchEvent(new Event('input', { bubbles: true }));
        });

      this.$form.on('click', '[data-clear-search]', (event) => {
        event.preventDefault();
        this.$input.val('');
        this.input.dispatchEvent(new Event('input', { bubbles: true }));
      });

      this.$container.on('opendDrawer', (event) => {
        if (!isTouchDevice) {
          $(event.currentTarget).one(
            'transitionend webkitTransitionEnd oTransitionEnd',
            () => {
              this.$input.focus();
            }
          );
        }
      });
    }

    onFocusOut() {
      setTimeout(() => {
        if (!this.container.contains(document.activeElement)) {
          this.close();
        }
      });
    }

    onKeyup(event) {
      if (this.getQuery().length || this.close(true)) {
        event.preventDefault();
        switch (event.code) {
          case 'ArrowUp':
            this.switchOption('up');
            break;
          case 'ArrowDown':
            this.switchOption('down');
            break;
        }
      }
    }

    onKeydown(event) {
      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
        event.preventDefault();
      }
    }

    switchOption(direction) {
      if (!this.container.getAttribute('open')) return;
      const isUp = direction === 'up';
      const selectedOption = this.results.querySelector(
        '[aria-selected="true"]'
      );
      const allOptions = this.results.querySelectorAll('li');
      let newOption = this.results.querySelector('li');

      if (isUp && !selectedOption) {
        newOption = allOptions[0];
      } else if (!isUp && selectedOption) {
        newOption = selectedOption.nextElementSibling || allOptions[0];
      } else if (isUp) {
        newOption =
          selectedOption.previousElementSibling ||
          allOptions[allOptions.length - 1];
      }

      if (newOption !== selectedOption) {
        newOption.setAttribute('aria-selected', true);
        if (selectedOption) {
          selectedOption.setAttribute('aria-selected', false);
        }
        this.setLiveRegionText(newOption.textContent);
        this.input.setAttribute('aria-activedescendant', newOption.id);
      }
    }

    getSearchResults(query) {
      if (!query.length) {
        this.$skeletonElement.hide();
        this.$results.hide().html('');
        this.$viewAll.hide();
        this.$formListKey.hide();
        this.$title.hide();
        this.container.removeAttribute('loading');
        return;
      }

      const sanitizedQuery = query.replace(' ', '-').toLowerCase();
      this.setLiveRegionLoadingState();

      if (this.cachedResults[sanitizedQuery]) {
        this.renderSearchResults(this.cachedResults[sanitizedQuery]);
      } else {
        fetch(
          `${searchUrl}/?${this.searchUrlForm}${encodeURIComponent(
            query
          )}&section_id=${this.sectionID}`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Error: ${response.status}`);
            }
            return response.text();
          })
          .then((html) => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const resultsHtml = doc.querySelector(
              `#shopify-section-${this.sectionID}`
            ).innerHTML;
            this.cachedResults[sanitizedQuery] = resultsHtml;
            this.renderSearchResults(resultsHtml);
          })
          .catch((error) => {
            console.error(error);
            this.close();
          });
      }
    }

    setLiveRegionLoadingState() {
      this.$skeletonElement = this.statusElement || this.$skeleton;
      this.$skeletonElement.show();
      this.$results.hide();
      this.$formListKey.hide();
      this.$viewAll.hide();
      this.container.setAttribute('loading', true);
    }

    renderSearchResults(resultsHtml) {
      const content = new DOMParser().parseFromString(resultsHtml, 'text/html');
      if (this.title) {
        this.title.innerHTML = content.querySelector(
          '[data-title-search]'
        ).innerHTML;
      }
      if (this.results) {
        this.results.innerHTML = content.querySelector(
          '[data-results-search]'
        ).innerHTML;
      }
      if (this.listSuggest) {
        this.listSuggest.innerHTML = content.querySelector(
          '[data-listsuggest-search]'
        ).innerHTML;
      }
      try {
        this.viewall.innerHTML = content.querySelector(
          '[data-viewAll-search]'
        ).innerHTML;
      } catch (error) {
        console.error(error);
      }

      if ('function' == typeof window.T4SThemeSP.reinitProductGridItem) {
        window.T4SThemeSP.reinitProductGridItem();
      }
      $body.trigger('currency:update');
      this.container.setAttribute('results', true);
      this.setLiveRegionResults();
      this.open();
    }

    close(force = false) {
      if (force) {
        this.input.value = '';
        this.container.removeAttribute('results');
      }
      const element = this.container.querySelector('[aria-selected="true"]');
      if (element) {
        element.setAttribute('aria-selected', false);
      }
      this.input.setAttribute('aria-activedescendant', '');
      this.container.removeAttribute('open');
      this.input.setAttribute('aria-expanded', false);
      this.resultsMaxHeight = false;
      this.results.removeAttribute('style');
      this.isOpen = false;
    }

    open() {
      this.results.style.maxHeight =
        this.resultsMaxHeight || `${this.getResultsMaxHeight()}px`;
      this.container.setAttribute('open', true);
      this.input.setAttribute('aria-expanded', true);
      this.isOpen = true;
    }

    setLiveRegionText(text) {
      this.$results.setAttribute('aria-live', 'assertive');
      this.$results.textContent = text;
    }

    getResultsMaxHeight() {
      this.resultsMaxHeight =
        window.innerHeight -
        document.querySelector('.section-header').getBoundingClientRect()
          .bottom;
      return this.resultsMaxHeight;
    }

    setLiveRegionResults() {
      this.$skeletonElement.hide();
      this.$results.show();
      this.$viewAll.show();
      this.$formListKey.show();
      this.$title.show();
      this.container.removeAttribute('loading');
    }
  }

  window.T4SThemeSP.predictiveSearchInt = () => {
    const initializePredictiveSearch = () => {
      // Initialize predictive search on elements that haven't been initialized yet
      $('[data-predictive-search]:not(.is--inted)').each((_, element) => {
        $(element).addClass('is--inted');
        element.predictiveSearch = new PredictiveSearch(element);
      });
    };

    const timeSearchKey = `timeSearch${cacheNameFirst}`;
    const dataSearchKey = `dataSearch${cacheNameFirst}`;
    const storedTime = isStorageSpSession
      ? parseInt(sessionStorage.getItem(timeSearchKey) || 0)
      : 0;
    const $hiddenSearchContainer = window.$('#search-hidden');

    // Check if the session time is valid
    if (storedTime > 0 && storedTime >= Date.now()) {
      window.T4SThemeSP.Helpers.promiseStylesheet(
        window.T4Sconfigs.stylesheet4
      ).then(() => {
        $hiddenSearchContainer.html(sessionStorage.getItem(dataSearchKey));
        initializePredictiveSearch();
        if (typeof window.T4SThemeSP.reinitProductGridItem === 'function') {
          window.T4SThemeSP.reinitProductGridItem();
        }
      });
    } else {
      window.T4SThemeSP.getToFetchSection('?section_id=search-hidden').then(
        (response) => {
          if (response !== 'NVT_94') {
            window.T4SThemeSP.Helpers.promiseStylesheet(
              window.T4Sconfigs.stylesheet4
            ).then(() => {
              const $response = $(response).html();
              $hiddenSearchContainer.html($response);
              initializePredictiveSearch();
              if (
                typeof window.T4SThemeSP.reinitProductGridItem === 'function'
              ) {
                window.T4SThemeSP.reinitProductGridItem();
              }
              if (isStorageSpSession) {
                const newStoredTime = Date.now() + 24e6; // 24 hours in milliseconds
                sessionStorage.setItem(timeSearchKey, newStoredTime);
                sessionStorage.setItem(dataSearchKey, $response);
              }
            });
          }
        }
      );
    }
  };
})(window.jQuery);

$(document).ready(() => {
  window.T4SThemeSP.predictiveSearchInt();
});
