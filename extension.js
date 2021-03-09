const St         = imports.gi.St; 
const Main       = imports.ui.main;
const GObject    = imports.gi.GObject;
const Gio        = imports.gi.Gio;
const PanelMenu  = imports.ui.panelMenu;
const PopupMenu  = imports.ui.popupMenu;
const Me         = imports.misc.extensionUtils.getCurrentExtension();
const GLib       = imports.gi.GLib; 
const Soup       = imports.gi.Soup

// local 
const Extension  = imports.misc.extensionUtils.getCurrentExtension();
const Translator = Extension.imports.translator;
const Utils      = Extension.imports.utils;

let myPopup; 

const GnomeTranslator = GObject.registerClass(
class GnomeTranslator extends PanelMenu.Button {

    _init(){
        super._init(1);
        let icon = new St.Icon({
            // icon_name : 'security-low-symbolic',
            gicon : Gio.icon_new_for_string( Me.dir.get_path() + '/logo.png'),
            style_class : 'system-status-icon'
        });
        this.add_child(icon);
        this.create_menu(); 
        this.open_close();
    }

    enable(){
        
        Main.panel.addToStatusArea('gnome-translator', gnomeTranslator, 1);

    }

    destroy(){

        super.destroy();
        print("Going to Destroy");
    }

    open_close(){
        this.menu.connect('open-state-changed', (menu, open) => {
            if (open){
                // Set default language
                print('opened');
            }
            else{
                print("closed");
            }
        });
    }
    
    create_menu (){

        // Create sub menu from language 
        let sourceLangDropList = new PopupMenu.PopupSubMenuMenuItem('Source Language');
        
        // fromEntryItem
        // toEntryItem

        // Create text entry for fromSubItem 
        let SourceTextBox = new PopupMenu.PopupBaseMenuItem({
            reactive: false,
            can_focus: false
            
        }); 

        let TargetTextBox = new PopupMenu.PopupBaseMenuItem({
            reactive: false,
            
        }); 
        //fromSearchEntry
        //toSearchEntry
        let sourceEntry = new St.Entry({
                        name: 'searchEntry',
                        style_class: 'search-entry',
                        can_focus: true,
                        hint_text: _('Type here to add text for translation..'),
                        track_hover: true,
                        hover: false
        });

        let targetEntry = new St.Entry({
                        name: 'searchEntry',
                        style_class: 'search-entry',
                        can_focus: false,
                        hint_text: _('Tranlsated text will show here'),
                        track_hover: false
        });



        // Create sub menu to language 
        let targetLangDropList = new PopupMenu.PopupSubMenuMenuItem('Target Language');

        let translateSection = new PopupMenu.PopupMenuSection();
        translateSection.actor.add_child(

            new PopupMenu.PopupImageMenuItem('translate', 
                'search-high-symbolic')
        );

        translateSection.actor.connect('button-press-event', () => {

            print('clicked');
            

        });

        let langNames = Utils.namesToView(Translator.getSupportedLangs());
        Array.prototype.forEach.call(langNames, name => {
            
            let sec = new PopupMenu.PopupMenuSection();
            let langItem = new PopupMenu.PopupMenuItem(name);
            sec.actor.add_child(langItem);    
            langItem.connect('activate', item => {
                targetLangDropList.label.set_text(item.label.get_text());
                print("Clicked");
            });
            targetLangDropList.menu.addMenuItem(sec);
        });
        Array.prototype.forEach.call(langNames, name => {
            
            let sec = new PopupMenu.PopupMenuSection();
            let langItem = new PopupMenu.PopupMenuItem(name);
            sec.actor.add_child(langItem);
            langItem.connect('activate', item => {
                sourceLangDropList.label.set_text(item.label.get_text());
                print("Clicked");
            });
            sourceLangDropList.menu.addMenuItem(sec);

        });

        // Add Everything to Menu 
        this.menu.addMenuItem(sourceLangDropList);
        SourceTextBox.actor.add(sourceEntry, { expand: true });
        TargetTextBox.actor.add(targetEntry, { expand: true });
        this.menu.addMenuItem(SourceTextBox);
        this.menu.addMenuItem(targetLangDropList); 
        this.menu.addMenuItem(TargetTextBox);  
        this.menu.addMenuItem(translateSection);
    } 
}
);



let gnomeTranslator; 

function init (){
    

}

function enable (){
    if(!gnomeTranslator){

        gnomeTranslator = new GnomeTranslator();
        gnomeTranslator.enable();

    }
}

function disable (){
    gnomeTranslator.destroy();
    gnomeTranslator = null;
}
