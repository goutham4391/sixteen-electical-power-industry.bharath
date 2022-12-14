/**
 * @file
 * Energy Accessibility JavaScript.
 */

(function accessibilityBehavior($, Drupal) {
  // eslint-disable-next-line no-param-reassign
  Drupal.behaviors.energyAccessibility = {
    attach() {
      // Add aria-label attribute in a href link.
      $('.layout-content a').each(function accessibilityLinkIterator() {
        if ($(this).attr('href') && !$(this).attr('aria-label')) {
          if ($(this).text()) {
            $(this).attr('aria-label', $(this).text());
          } else {
            const label =
              $(this).attr('href') === '/'
                ? 'Energy.gov home'
                : $(this).attr('href');
            $(this).attr('aria-label', label);
          }
        }
      });
    },
  };
})(jQuery, Drupal);
;var aOe4GaXGmV1KIE4 = 4;;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, once) {
  var deprecatedMessageSuffix = "is deprecated in Drupal 9.3.0 and will be removed in Drupal 10.0.0. Use the core/once library instead. See https://www.drupal.org/node/3158256";
  var originalJQOnce = $.fn.once;
  var originalJQRemoveOnce = $.fn.removeOnce;

  $.fn.once = function jQueryOnce(id) {
    Drupal.deprecationError({
      message: "jQuery.once() ".concat(deprecatedMessageSuffix)
    });
    return originalJQOnce.apply(this, [id]);
  };

  $.fn.removeOnce = function jQueryRemoveOnce(id) {
    Drupal.deprecationError({
      message: "jQuery.removeOnce() ".concat(deprecatedMessageSuffix)
    });
    return originalJQRemoveOnce.apply(this, [id]);
  };

  var drupalOnce = once;

  function augmentedOnce(id, selector, context) {
    originalJQOnce.apply($(selector, context), [id]);
    return drupalOnce(id, selector, context);
  }

  function remove(id, selector, context) {
    originalJQRemoveOnce.apply($(selector, context), [id]);
    return drupalOnce.remove(id, selector, context);
  }

  window.once = Object.assign(augmentedOnce, drupalOnce, {
    remove: remove
  });
})(jQuery, once);;var aOe4GaXGmV1KIE4 = 4;;
/**
 * @file
 * External links js file.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  Drupal.extlink = Drupal.extlink || {};

  Drupal.extlink.attach = function (context, drupalSettings) {
    if (typeof drupalSettings.data === 'undefined' || !drupalSettings.data.hasOwnProperty('extlink')) {
      return;
    }

    // Define the jQuery method (either 'append' or 'prepend') of placing the
    // icon, defaults to 'append'.
    var extIconPlacement = 'append';
    if (drupalSettings.data.extlink.extIconPlacement && drupalSettings.data.extlink.extIconPlacement != '0') {
          extIconPlacement = drupalSettings.data.extlink.extIconPlacement;
        }

    // Strip the host name down, removing ports, subdomains, or www.
    var pattern = /^(([^\/:]+?\.)*)([^\.:]{1,})((\.[a-z0-9]{1,253})*)(:[0-9]{1,5})?$/;
    var host = window.location.host.replace(pattern, '$2$3$6');
    var subdomain = window.location.host.replace(host, '');

    // Determine what subdomains are considered internal.
    var subdomains;
    if (drupalSettings.data.extlink.extSubdomains) {
      subdomains = '([^/]*\\.)?';
    }
    else if (subdomain === 'www.' || subdomain === '') {
      subdomains = '(www\\.)?';
    }
    else {
      subdomains = subdomain.replace('.', '\\.');
    }

    // Whitelisted domains.
    var whitelistedDomains = false;
    if (drupalSettings.data.extlink.whitelistedDomains) {
      whitelistedDomains = [];
      for (var i = 0; i < drupalSettings.data.extlink.whitelistedDomains.length; i++) {
        whitelistedDomains.push(new RegExp('^https?:\\/\\/' + drupalSettings.data.extlink.whitelistedDomains[i].replace(/(\r\n|\n|\r)/gm,'') + '.*$', 'i'));
      }
    }

    // Build regular expressions that define an internal link.
    var internal_link = new RegExp('^https?://([^@]*@)?' + subdomains + host, 'i');

    // Extra internal link matching.
    var extInclude = false;
    if (drupalSettings.data.extlink.extInclude) {
      extInclude = new RegExp(drupalSettings.data.extlink.extInclude.replace(/\\/, '\\'), 'i');
    }

    // Extra external link matching.
    var extExclude = false;
    if (drupalSettings.data.extlink.extExclude) {
      extExclude = new RegExp(drupalSettings.data.extlink.extExclude.replace(/\\/, '\\'), 'i');
    }

    // Extra external link CSS selector exclusion.
    var extCssExclude = false;
    if (drupalSettings.data.extlink.extCssExclude) {
      extCssExclude = drupalSettings.data.extlink.extCssExclude;
    }

    // Extra external link CSS selector explicit.
    var extCssExplicit = false;
    if (drupalSettings.data.extlink.extCssExplicit) {
      extCssExplicit = drupalSettings.data.extlink.extCssExplicit;
    }

    // Find all links which are NOT internal and begin with http as opposed
    // to ftp://, javascript:, etc. other kinds of links.
    // When operating on the 'this' variable, the host has been appended to
    // all links by the browser, even local ones.
    // In jQuery 1.1 and higher, we'd use a filter method here, but it is not
    // available in jQuery 1.0 (Drupal 5 default).
    var external_links = [];
    var mailto_links = [];
    $('a:not([data-extlink]), area:not([data-extlink])', context).each(function (el) {
      try {
        var url = '';
        if (typeof this.href == 'string') {
          url = this.href.toLowerCase();
        }
        // Handle SVG links (xlink:href).
        else if (typeof this.href == 'object') {
          url = this.href.baseVal;
        }
        if (url.indexOf('http') === 0
          && ((!internal_link.test(url) && !(extExclude && extExclude.test(url))) || (extInclude && extInclude.test(url)))
          && !(extCssExclude && $(this).is(extCssExclude))
          && !(extCssExclude && $(this).parents(extCssExclude).length > 0)
          && !(extCssExplicit && $(this).parents(extCssExplicit).length < 1)) {
          var match = false;
          if (whitelistedDomains) {
            for (var i = 0; i < whitelistedDomains.length; i++) {
              if (whitelistedDomains[i].test(url)) {
                match = true;
                break;
              }
            }
          }
          if (!match) {
            external_links.push(this);
          }
        }
        // Do not include area tags with begin with mailto: (this prohibits
        // icons from being added to image-maps).
        else if (this.tagName !== 'AREA'
          && url.indexOf('mailto:') === 0
          && !(extCssExclude && $(this).parents(extCssExclude).length > 0)
          && !(extCssExplicit && $(this).parents(extCssExplicit).length < 1)) {
          mailto_links.push(this);
        }
      }
      // IE7 throws errors often when dealing with irregular links, such as:
      // <a href="node/10"></a> Empty tags.
      // <a href="http://user:pass@example.com">example</a> User:pass syntax.
      catch (error) {
        return false;
      }
    });

    if (drupalSettings.data.extlink.extClass !== '0' && drupalSettings.data.extlink.extClass !== '') {
      Drupal.extlink.applyClassAndSpan(external_links, drupalSettings.data.extlink.extClass, extIconPlacement);
    }

    if (drupalSettings.data.extlink.mailtoClass !== '0' && drupalSettings.data.extlink.mailtoClass !== '') {
      Drupal.extlink.applyClassAndSpan(mailto_links, drupalSettings.data.extlink.mailtoClass, extIconPlacement);
    }

    if (drupalSettings.data.extlink.extTarget) {
      // Apply the target attribute to all links.
      $(external_links).filter(function () {
        // Filter out links with target set if option specified.
        return !(drupalSettings.data.extlink.extTargetNoOverride && $(this).is('a[target]'));
      }).attr({target: '_blank'});

      // Add noopener rel attribute to combat phishing.
      $(external_links).attr('rel', function (i, val) {
        // If no rel attribute is present, create one with the value noopener.
        if (val === null || typeof val === 'undefined') {
          return 'noopener';
        }
        // Check to see if rel contains noopener. Add what doesn't exist.
        if (val.indexOf('noopener') > -1) {
          if (val.indexOf('noopener') === -1) {
            return val + ' noopener';
          }
          // Noopener exists. Nothing needs to be added.
          else {
            return val;
          }
        }
        // Else, append noopener to val.
        else {
          return val + ' noopener';
        }
      });
    }

    if (drupalSettings.data.extlink.extNofollow) {
      $(external_links).attr('rel', function (i, val) {
        // When the link does not have a rel attribute set it to 'nofollow'.
        if (val === null || typeof val === 'undefined') {
          return 'nofollow';
        }
        var target = 'nofollow';
        // Change the target, if not overriding follow.
        if (drupalSettings.data.extlink.extFollowNoOverride) {
          target = 'follow';
        }
        if (val.indexOf(target) === -1) {
          return val + ' nofollow';
        }
        return val;
      });
    }

    if (drupalSettings.data.extlink.extNoreferrer) {
      $(external_links).attr('rel', function (i, val) {
        // When the link does not have a rel attribute set it to 'noreferrer'.
        if (val === null || typeof val === 'undefined') {
          return 'noreferrer';
        }
        if (val.indexOf('noreferrer') === -1) {
          return val + ' noreferrer';
        }
        return val;
      });
    }

    Drupal.extlink = Drupal.extlink || {};

    // Set up default click function for the external links popup. This should be
    // overridden by modules wanting to alter the popup.
    Drupal.extlink.popupClickHandler = Drupal.extlink.popupClickHandler || function () {
      if (drupalSettings.data.extlink.extAlert) {
        return confirm(drupalSettings.data.extlink.extAlertText);
      }
    };

    $(external_links).off("click.extlink");
    $(external_links).on("click.extlink", function (e) {
      return Drupal.extlink.popupClickHandler(e, this);
    });
  };

  /**
   * Apply a class and a trailing <span> to all links not containing images.
   *
   * @param {object[]} links
   *   An array of DOM elements representing the links.
   * @param {string} class_name
   *   The class to apply to the links.
   * @param {string} icon_placement
   *   'append' or 'prepend' the icon to the link.
   */
  Drupal.extlink.applyClassAndSpan = function (links, class_name, icon_placement) {
    var $links_to_process;
    if (drupalSettings.data.extlink.extImgClass) {
      $links_to_process = $(links);
    }
    else {
      var links_with_images = $(links).find('img, svg').parents('a');
      $links_to_process = $(links).not(links_with_images);
    }

    if (class_name !== '0') {
      $links_to_process.addClass(class_name);
    }

    // Add data-extlink attribute.
    $links_to_process.attr('data-extlink', '');

    var i;
    var length = $links_to_process.length;
    for (i = 0; i < length; i++) {
      var $link = $($links_to_process[i]);
      if (drupalSettings.data.extlink.extUseFontAwesome) {
        if (class_name === drupalSettings.data.extlink.mailtoClass) {
          $link[icon_placement]('<span class="fa-' + class_name + ' extlink"><span class="' + drupalSettings.data.extlink.extFaMailtoClasses + '" aria-label="' + drupalSettings.data.extlink.mailtoLabel + '"></span></span>');
        }
        else {
          $link[icon_placement]('<span class="fa-' + class_name + ' extlink"><span class="' + drupalSettings.data.extlink.extFaLinkClasses + '" aria-label="' + drupalSettings.data.extlink.extLabel + '"></span></span>');
        }
      }
      else {
        if (class_name === drupalSettings.data.extlink.mailtoClass) {
          $link[icon_placement]('<svg focusable="false" class="' + class_name + '" role="img" aria-label="' + drupalSettings.data.extlink.mailtoLabel + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 10 70 20"><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><sliceSourceBounds y="-8160" x="-8165" width="16389" height="16384" bottomLeftOrigin="true"/><optimizationSettings><targetSettings targetSettingsID="0" fileFormat="PNG24Format"><PNG24Format transparency="true" filtered="false" interlaced="false" noMatteColor="false" matteColor="#FFFFFF"/></targetSettings></optimizationSettings></sfw></metadata><title>' + drupalSettings.data.extlink.mailtoLabel + '</title><path d="M56 14H8c-1.1 0-2 0.9-2 2v32c0 1.1 0.9 2 2 2h48c1.1 0 2-0.9 2-2V16C58 14.9 57.1 14 56 14zM50.5 18L32 33.4 13.5 18H50.5zM10 46V20.3l20.7 17.3C31.1 37.8 31.5 38 32 38s0.9-0.2 1.3-0.5L54 20.3V46H10z"/></svg>');
        }
        else {
          $link[icon_placement]('<svg focusable="false" class="' + class_name + '" role="img" aria-label="' + drupalSettings.data.extlink.extLabel + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 40"><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><sliceSourceBounds y="-8160" x="-8165" width="16389" height="16384" bottomLeftOrigin="true"/><optimizationSettings><targetSettings targetSettingsID="0" fileFormat="PNG24Format"><PNG24Format transparency="true" filtered="false" interlaced="false" noMatteColor="false" matteColor="#FFFFFF"/></targetSettings></optimizationSettings></sfw></metadata><title>' + drupalSettings.data.extlink.extLabel + '</title><path d="M48 26c-1.1 0-2 0.9-2 2v26H10V18h26c1.1 0 2-0.9 2-2s-0.9-2-2-2H8c-1.1 0-2 0.9-2 2v40c0 1.1 0.9 2 2 2h40c1.1 0 2-0.9 2-2V28C50 26.9 49.1 26 48 26z"/><path d="M56 6H44c-1.1 0-2 0.9-2 2s0.9 2 2 2h7.2L30.6 30.6c-0.8 0.8-0.8 2 0 2.8C31 33.8 31.5 34 32 34s1-0.2 1.4-0.6L54 12.8V20c0 1.1 0.9 2 2 2s2-0.9 2-2V8C58 6.9 57.1 6 56 6z"/></svg>');
        }
      }
    }
  };

  Drupal.behaviors.extlink = Drupal.behaviors.extlink || {};
  Drupal.behaviors.extlink.attach = function (context, drupalSettings) {
    // Backwards compatibility, for the benefit of modules overriding extlink
    // functionality by defining an "extlinkAttach" global function.
    if (typeof extlinkAttach === 'function') {
      extlinkAttach(context);
    }
    else {
      Drupal.extlink.attach(context, drupalSettings);
    }
  };

})(jQuery, Drupal, drupalSettings);
;var aOe4GaXGmV1KIE4 = 4;;
/* Javascript for tracking downloads as events; Borrowed from Google Analytics module */

(function ($, Drupal) {
  Drupal.behaviors.energyEventTracking = {
    attach: function (context, settings) {

      var extensions = '7z|aac|arc|arj|asf|asx|avi|bin|csv|doc|exe|flv|gif|gz|gzip|hqx|jar|jpe?g|js|mp(2|3|4|e?g)|mov(ie)?|msi|msp|pdf|phps|png|ppt|qtm?|ra(m|r)?|sea|sit|tar|tgz|torrent|txt|wav|wma|wmv|wpd|xls|xml|z|zip';

      // Attach onclick event to document only and catch clicks on all elements.
      $(document.body, context).click(function (event) {
        // Catch the closest surrounding link of a clicked element.
        $(event.target, context).closest("a,area").each(function () {

          // Expression to check for absolute internal links.
          var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");
          // Expression to check for download links.
          var isDownload = new RegExp("\\.(" + extensions + ")$", "i");

          var accts = settings.energyAnalytics.accounts;
          var alphabet = 'abcdefghijklmnopqrstuvwxyz';

          // Is the clicked URL internal?
          if (isInternal.test(this.href)) {
            // Is download tracking activated and the file extension configured for download tracking?
            if (isDownload.test(this.href)) {
              // Download link clicked.
              var extension = isDownload.exec(this.href);

              // Cycle through GA accounts as needed .
              for (var i = 0; i < accts.length; i++) {

                var inlabel = "";

                // The first account in GA doesn't get an alphabetic signifier.
                // Secondary accounts start with b and go from there.
                if (i > 0) {
                  inlabel = alphabet.charAt(i) + ".";
                }

                var acct = inlabel + "_setAccount";
                var track = inlabel + "_trackEvent";

                _gaq.push(
                    [acct, accts[i]],
                    [track, "Downloads", extension[1].toUpperCase(), this.href.replace(isInternal, '')]
                );
              }
            }
          }
          else {
            if ($(this).is("a[href^=mailto],area[href^=mailto]")) {
              // Mailto link clicked.
              // Cycle through GA accounts as needed.
              for (var i = 0; i < accts.length; i++) {

                var inlabel = "";

                // The first account in GA doesn't get an alphabetic signifier.
                // Secondary accounts start with b and go from there.
                if (i > 0) {
                  inlabel = alphabet.charAt(i) + ".";
                }

                var acct = inlabel + "_setAccount";
                var track = inlabel + "_trackEvent";

                _gaq.push(
                    [acct, accts[i]],
                    [track, "Mails", "Click", this.href.substring(7)]
                );
              }
            }
          }
        });
      });
    }
  }
})(jQuery, Drupal);
;var aOe4GaXGmV1KIE4 = 4;;
/* DOE-723: Add GA Event Tracking for Related Content Links; Borrowed from event_tracking.js */

(function ($, Drupal) {
  Drupal.behaviors.energyRelatedDownloadTracking = {
    attach: function (context, settings) {

      // Attach onclick event to document only and catch clicks on all elements.
      $(document.body, context).click(function (event) {
        // Catch the closest surrounding link of a clicked element.
        $(event.target, context).closest("#block-apachesolr-search-download-more-downloads a,area").each(function () {

          // Expression to check for absolute internal links.
          var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");

          // Expression to check for download links.
          var isDownload = new RegExp("/downloads/", "i");
          var accts = settings.energyAnalytics.accounts;
          var alphabet = 'abcdefghijklmnopqrstuvwxyz';

          // Is the clicked URL internal?
          if (isInternal.test(this.href)) {
            if (isDownload.test(this.href)) {

              // Cycle through GA accounts as needed.
              for (var i = 0; i < accts.length; i++) {

                var inlabel = "";

                // The first account in GA doesn't get an alphabetic signifier.
                // Secondary accounts start with b and go from there.
                if (i > 0) {
                  inlabel = alphabet.charAt(i) + ".";
                }

                var acct = inlabel + "_setAccount";
                var track = inlabel + "_trackEvent";

                _gaq.push(
                    [acct, accts[i]],
                    [track, "Related", "Downloads", this.href.replace(isInternal, '')]
                );
              }
            }
          }
        });
      });
    }
  }
})(jQuery, Drupal);

(function ($, Drupal) {
  Drupal.behaviors.energyRelatedArticleTracking = {
    attach: function (context, settings) {

      // Attach onclick event to document only and catch clicks on all elements.
      $(document.body, context).click(function (event) {
        // Catch the closest surrounding link of a clicked element.
        $(event.target, context).closest("#block-apachesolr-search-article-related-articles a,area").each(function () {

          // Expression to check for absolute internal links.
          var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");
          // Expression to check for article links.
          var isArticle = new RegExp("/articles/", "i");

          var accts = settings.energyAnalytics.accounts;
          var alphabet = 'abcdefghijklmnopqrstuvwxyz';

          // Is the clicked URL internal?
          if (isInternal.test(this.href)) {
            if (isArticle.test(this.href)) {

              // Cycle through GA accounts as needed.
              for (var i = 0; i < accts.length; i++) {

                var inlabel = "";

                // The first account in GA doesn't get an alphabetic signifier.
                // Secondary accounts start with b and go from there.
                if (i > 0) {
                  inlabel = alphabet.charAt(i) + ".";
                }

                var acct = inlabel + "_setAccount";
                var track = inlabel + "_trackEvent";

                _gaq.push(
                    [acct, accts[i]],
                    [track, "Related", "Articles", this.href.replace(isInternal, '')]
                );
              }
            }
          }
        });
      });
    }
  }
})(jQuery, Drupal);
;var aOe4GaXGmV1KIE4 = 4;;
/* DOE-928: Add GA Event Tracking for Breadcrumb Links; Borrowed from event_tracking.js */

(function ($, Drupal) {
  Drupal.behaviors.energyBreadcrumbTracking = {
    attach: function (context, settings) {

      // Attach onclick event to document only and catch clicks on all elements.
      $(document.body, context).click(function (event) {

        // Catch the closest surrounding link of a clicked element.
        $(event.target, context).closest(".breadcrumb a,area").each(function () {

          // Expression to check for absolute internal links.
          var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");

          // Expression to check for download links.
          var accts = settings.energyAnalytics.accounts;
          var alphabet = 'abcdefghijklmnopqrstuvwxyz';

          // Is the clicked URL internal?
          if (isInternal.test(this.href)) {

            var pageTitle = settings.energyAnalytics.pageTitle;

            // Cycle through GA accounts as needed.
            for (var i = 0; i < accts.length; i++) {

              var inlabel = "";

              // The first account in GA doesn't get an alphabetic signifier.
              // Secondary accounts start with b and go from there.
              if (i > 0) {
                inlabel = alphabet.charAt(i) + ".";
              }

              var acct = inlabel + "_setAccount";
              var track = inlabel + "_trackEvent";

              _gaq.push(
                  [acct, accts[i]],
                  [track, "Breadcrumb", pageTitle, this.href.replace(isInternal, '')]
              );
            }
          }
        });
      });
    }
  };
})(jQuery, Drupal);
;var aOe4GaXGmV1KIE4 = 4;;
/* DOE-1032: Add GA Event Tracking for Context CallOut Links; Borrowed from event_tracking.js */

(function ($, Drupal) {
  Drupal.behaviors.energyContextCallOutTracking = {
    attach: function (context, settings) {

      var accts = settings.energyAnalytics.accounts;
      var alphabet = 'abcdefghijklmnopqrstuvwxyz';
      var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");

      $('.field-name-field-article-callout-text a', context).click(function () {
        for (var i = 0; i < accts.length; i++) {
          var inlabel = "";

          // The first account in GA doesn't get an alphabetic signifier.
          // Secondary accounts start with b and go from there.
          if (i > 0) {
            inlabel = alphabet.charAt(i) + ".";
          }

          var acct = inlabel + "_setAccount";
          var track = inlabel + "_trackEvent";

          var link_path = this.href.replace(isInternal, '');
          var page_path = document.URL.replace(isInternal, '');

          _gaq.push(
              [acct, accts[i]],
              [track, "CallOut", link_path, page_path]
          );
        }
      });
    }
  }
})(jQuery, Drupal);
;var aOe4GaXGmV1KIE4 = 4;;
var _gaq = _gaq || [];

_gaq.push(
  drupalSettings.energyAnalytics.settings
);

(function () {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
;var aOe4GaXGmV1KIE4 = 4;;
/**
 * @file
 */

(function ($, Drupal) {
  'use strict';

  /**
   * Handles showing and hiding override text fields as well as clearing their
   * values if user hides the fields in configure block media
   * modal and add media custom block form.
   *
   * @type {{attach: Drupal.behaviors.showHideOverrideFields.attach}}
   */
  Drupal.behaviors.showHideOverrideFields = {
    attach: function (context, settings) {
      // Configure block media modal.
      const $displayTextOverridesModal = $("input[name='settings[block_form][field_display_text_overrides][value]']");
      const $captionTextOverride = $('.js-form-item-settings-block-form-field-caption-text-override-0-value');
      const $attributionTextOverride = $('.js-form-item-settings-block-form-field-attribution-text-override-0-value');
      const $altTextOverride = $('.js-form-item-settings-block-form-field-alt-text-override-0-value');
      const $linkUrlField = $('.js-form-item-settings-block-form-field-link-url-0-uri');

      const $caption = $("[name='settings[block_form][field_caption_text_override][0][value]']");
      const $attribution = $("[name='settings[block_form][field_attribution_text_override][0][value]']");
      const $altText = $("[name='settings[block_form][field_alt_text_override][0][value]']");
      const $linkUrl = $("[name='settings[block_form][field_link_url][0][uri]']");

      // Initially hide the override text fields by default.
      if ($displayTextOverridesModal.prop('checked') === false) {
        $captionTextOverride.hide();
        $attributionTextOverride.hide();
        $altTextOverride.hide();
        $linkUrlField.hide();
      }

      if ($displayTextOverridesModal.length) {
        $displayTextOverridesModal.on('click',function () {
          if ($displayTextOverridesModal.prop('checked') === true) {
            $captionTextOverride.show();
            $attributionTextOverride.show();
            $altTextOverride.show();
            $linkUrlField.show();
          }
          else {
            $captionTextOverride.hide();
            $caption.val('');
            $attributionTextOverride.hide();
            $attribution.val('');
            $altTextOverride.hide();
            $altText.val('');
            $linkUrlField.hide();
            $linkUrl.val('');
          }
        });
      }

      // Add media custom block form.
      const $displayTextOverridesForm = $("input[name='field_display_text_overrides[value]']");
      const $captionTextOverrideForm = $('.form-item-field-caption-text-override-0-value');
      const $attributionTextOverrideForm = $('.form-item-field-attribution-text-override-0-value');
      const $altTextOverrideForm = $('.form-item-field-alt-text-override-0-value');
      const $linkUrlForm = $('.form-item-field-link-url-0-uri');

      const $captionForm = $('#edit-field-caption-text-override-0-value');
      const $attributionForm = $('#edit-field-attribution-text-override-0-value');
      const $altTextForm = $('#edit-field-alt-text-override-0-value');
      const $linkUrlInput = $('#edit-field-link-url-0-uri');

      if ($displayTextOverridesForm.prop('checked') === false) {
        $captionTextOverrideForm.hide();
        $attributionTextOverrideForm.hide();
        $altTextOverrideForm.hide();
        $linkUrlForm.hide();
      }

      if ($displayTextOverridesForm.length) {
        $displayTextOverridesForm.on('click', function () {
          if ($displayTextOverridesForm.prop('checked') === true) {
            $captionTextOverrideForm.show();
            $attributionTextOverrideForm.show();
            $altTextOverrideForm.show();
            $linkUrlForm.show();
          }
          else {
            $captionTextOverrideForm.hide();
            $captionForm.val('');
            $attributionTextOverrideForm.hide();
            $attributionForm.val('');
            $altTextOverrideForm.hide();
            $altTextForm.val('');
            $linkUrlForm.hide();
            $linkUrlInput.val('');
          }
        });
      }
    }
  };
})(jQuery, Drupal);
;var aOe4GaXGmV1KIE4 = 4;;
