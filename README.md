Persistent-Folder-Tree-Accordion
================================

This is simple JQuery Plugin which creates the persistent accordion on HTML Tree List.

This works same way as other folder tree plugin works but its behaviour is persistent. 
However, it does not use images and css. It has the "useCookie" option which will enable
the persistent behaviour.

If list is treated as folder then, it needs to have folder class unless any other provided in 
the settings. 


## HTML Structure:
```html
<div class="foldertree">
   <ul id='report_tree' class='accordion_report_tree'>
     <li class='folder'><a href="javascript:;">David CEO</a>
       <ol>
         <li class="folder"><a href="javascript:;">Peter Development Manager</a>
           <ul>
             <li><a href="javascript:;">Ken Project Manager</a></li>
             <li><a href="javascript:;">Tom Project Manager</a></li>
           </ul>
         </li>
         <li><a href="javascript:;">Anna Development Manager</a>
           <ol>
             <li><a href="javascript:;">Bob Project Manager</a></li>
             <li><a href="javascript:;">Jerry Project Manager</a></li>
           </ol>
         </li>
       </ol>
     </li>
   </ul>
</div>
```

## Usage:
```javascript
$(document).ready(function() { 
  $(".accordion_report_tree").FolderTreeAccordion({
   useCookie: true,
   folderClass: 'folder',
   folderClick : function (event, el) {
     alert('folerElementClicked');
   },
   fileClick : function (event, el) {
     alert('fileElementclicked');
   }
  });
  
  $(".accordion_report_tree").bind("FolderTreeAccordion.onFileClick", function(event, clickedElement) {
    alert('fileClicked');
  })
});
```

## API:
<pre>
 FolderClick(event, el)
 Triggered when "folder" (list which have folder class) is clicked
 +event 
   DOM event Object.
 +el
   Anchor Tag which parent li has 'folder' class.
</pre>
```javascript
$(".accordion_report_tree").FolderTreeAccordion({
  folderClick : function (event, el) {
     alert('folderElementClicked');
  },
});

// Bind Folderclick Event.
$(".accordion_report_tree").bind("FolderTreeAccordion.onFolderClick", function(event, el) {
});
```

FileClick(event, el)
Triggered when "file" (list which does not have folder class) is clicked

+event 
  DOM event Object.
+el
  Anchor Tag hich parent li does not have 'folder' class.
```javascript
$(".accordion_report_tree").FolderTreeAccordion({
  fileClick : function (event, el) {
     alert('fileElementClicked');
  },
});

// Bind FileClick Event
$(".accordion_report_tree").bind("FolderTreeAccordion.onFileClick", function(event, el) {
});
```


## Important: 
If you using persistent/cookie behaviour then, css selector ul/ol need to have id attribute. 

