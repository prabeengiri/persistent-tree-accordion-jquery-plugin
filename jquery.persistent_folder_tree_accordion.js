/**
 * jQuery PersistentFolderTreeAccordion 0.1
 * 
 * CopyRight 2014 Prabin Giri
 *  
 * Download Source: 
 *   https://github.com/prabeengiri/Persistent-Folder-Tree-Accordion/archive/master.zip
 * Depends:
 *   jQuery.js
 * 
 * This Javacsript creates the clickable accordion with Javascript that
 * opens/and closes the lists. Its basically designed for the folder tree.
 * 
 * It also saves the state in the cookie. When visited next time, based 
 * on the previous open/close state, it will open or close the folders.  
 */

(function($) {
  // Constuctor Function.
  var FolderTreeAccordion = function ($listElement, options, $) {
    this.list = $listElement;
    this.isCookiePresent = false;
    this.settings = $.extend({}, this.defaults, options);
    this.init();
    
    var self = this;
    
    // Attach folder click event.
    this.list.find("li." + this.settings.folderClass + " a").click(function (event) {
      return function ($a) {
        self.folderClick(event, $a);
      }($(this));
    });
    
    // Attach File Click Event.
    // Some anchor tag might have sibling anchor tag, in that case we dont want to assign
    // on all the anchor tags in the list.
    var anchorTagSelectors = this.list.find("li:not('." + this.settings.folderClass + "') a");
    if (this.settings.fileLinkClass != null) {
      anchorTagSelectors = this.list.find("li:not('." + this.settings.folderClass + "') a." + this.settings.fileLinkClass);
    } 
    anchorTagSelectors.click(function (event) {
      self.fileClick(event, $(this));
    });
  }; 
  
  FolderTreeAccordion.prototype = {
    // Default Configuration.
    defaults: {
      useCookie : true,
      cookieExpiry: 150,
      toggleAll : true,
      folderClick: function (event, a) {},
      fileClick : function (event, a) {},
      folderClass: 'folder',
      // Anchor tag inside the file list on which click event is attached.
      fileLinkClass : null,
      emptyText : "No data found."
    },
    
    /***
     * Initialze the tree by settings its ids, and persist if
     * selected on the settings. Also attach the events to the
     * list items. 
     */
    init: function () {
      
      if (this.list.size() == 0 || this.list.children().size() == 0) {
        this.list.replaceWith("<div>" + this.settings.emptyText + "</div>");
      }
      
      if (this.settings.useCookie) {
        if (this.list.attr('id') == undefined || this.list.attr('id') == "") {
          throw new Error("FolderTreeAccordion: If 'useCookie' option is used, then CSS selector element(root UL/OL) needs to have valid 'id' attribute.");
        }
        this.persistBehaviour();
      }
    
      // If cookie is not used or cookie is used but using for the first time.
      if (!this.settings.useCookie || !this.cookieExists()) {
        this.defaultBehaviour();
      };
    },
    
    /**
     * When anchor tag whose parent list is not folder,
     * then this handler gets executed. It just exposes the
     * behaviours for outside to act upon this event.
     * 
     * @param event
     *   DOM click event object.
     * @param $a
     *   JQuery Anchor Tag Object thats being clicked. 
     */
    fileClick : function (event, $a) {
      this.settings.fileClick(event, $a);
      this.list.trigger('FolderTreeAccordion.onFileClick', [$a]);
    }, 
    
    /**
     * When anchor tag with parent li as folder(class folder) is
     * clicked. It exposes the clicked event.  
     * @param event
     *   DOM event object.
     * @param $a
     *   JQuery Anchor Tag Object thats being clicked
     */
    folderClick : function(event, $a) {
      var $li = $a.parent('li');
      var self = this;
      if (!$li.hasClass(this.settings.folderClass)) {
        return;
      }
      
      // Don't do anything as its folder.
      event.preventDefault();
      
      // Toggle slide Behvaiour
      $li.toggleClass('expanded')
       .children('ul, ol')
       .stop() //to avoid rapid clicking. 
       .slideToggle('normal' , function() {
         
         self.settings.folderClick(event, $a);
         self.list.trigger('FolderTreeAccordion.onFolderClick', [$a]);
         
         if (self.settings.useCookie) {
           self.setCookie($li);
         }
       });
    },
    
    /**
     * When anchor tag is clicked, then cookie is set
     * with the id that its parent 'li' has. 
     * 
     * @param $li
     *   JQuery List element which has the class "expanded".
     */
    setCookie : function ($li) {
      if ($li.hasClass('expanded')) 
        $.cookie($li.attr('id'), '1', { expires: this.settings.cookieExpiry });
      else 
        $.cookie($li.attr('id'), '0');
    },
    
    /**
     * This checks the expanded/collapsed state of tree
     * by checking the cookie and expading/collapsing
     * accordingly.
     */
    persistBehaviour : function() {
      var self = this;
      if(this.settings.useCookie) {
        this.addIds();
        this.list.find('li.' + this.settings.folderClass)
         .each(function(i){
          if ($.cookie( $(this).attr('id')) == '1') {
            self.expandFolder($(this));
            self.isCookiePresent = true;
          } else if ($.cookie( $(this).attr('id')) == '0') {
            self.isCookiePresent = true;
            self.collapseFolder($(this));
          } else {
            self.collapseFolder($(this));
          } 
        }); 
      };
      
    },
    
    expandFolder : function (el) {
      el.addClass('expanded').children('ul,ol').show();
    },
    
    collapseFolder: function(el) {
      el.children('ul,ol').hide();
    },
    
    /**
     * Check if there is any cookie info
     * To verify if user is visiting for the 
     * first time.
     */ 
    cookieExists: function() {
      if (!this.settings.useCookie) 
        return false;
      return this.isCookiePresent;
    },
    
    
    /**
     * Default behaviour that opens first sets of matche folders.
     * 
     * Open inner most folder of first folder if there is nothing set in the cookie.
     * This is used if there is no any information in the cookie,
     * and also 'useCookie' attribute is set to 'false'. 
     */
    defaultBehaviour: function () {
      var self = this;
      // Hide all.
      this.list.find('li').each(function() {
        self.collapseFolder($(this));
      });
      
      var list = this.list; 
      var firstFolderChildren = list.children('li:first');
      while(firstFolderChildren.hasClass('folder')) {
        this.expandFolder(firstFolderChildren);
        firstFolderChildren = firstFolderChildren.children('ul').children('li:first');
      }
    },
    
    /**
     * Add the IDs to all the folder when document is ready. 
     * Based on the that id attribute, cookie is used to 
     * persist the behavioir. To make sure cookie key does not
     * clash by same name, therefore id attribute of the list is
     * used to prefix the cookie name.
     */
    addIds : function () {
      var self = this;
      this.list.find('li.' + this.settings.folderClass)
      .attr('id', function(index) { 
        return self.list.attr('id') + "_" + $(this)
         .children('a')
         .text()
         //replace all spaces with underscore.
         .replace(/ /g,'_') 
         .toLowerCase(); 
      });
    }
  };
  
  // Define Jquery Function and initialized the Accordion class.
  $.fn.FolderTreeAccordion = function(options) {
    return this.each(function () {
      new FolderTreeAccordion($(this), options, $);
      return this;
    });
  };
  
})(jQuery);
