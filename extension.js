const St         = imports.gi.St; 
const Main       = imports.ui.main;
const GObject    = imports.gi.GObject;
const Gio        = imports.gi.Gio;
const PanelMenu  = imports.ui.panelMenu;
const PopupMenu  = imports.ui.popupMenu;
const Me         = imports.misc.extensionUtils.getCurrentExtension();
const GLib       = imports.gi.GLib; 
const Clutter    = imports.gi.Clutter;
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
        this.sourceEntry = null;
        this.add_child(icon);
        this.create_menu(); 
        this.open_close();

        this.sourceLang  = "en";
        this.targetLang  = "de";
        this._sourceText = "";
    }

    enable(){
        
        Main.panel.addToStatusArea('gnome-translator', gnomeTranslator, 1);

    }
    
    destroy(){

        super.destroy();
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

    _onKeyPressed(o, e){
        let symbol = e.get_key_symbol();
        if (symbol == Clutter.Return     || 
            symbol == Clutter.KEY_Return ||
            symbol == Clutter.KP_Enter   ){
            // get and translate text 
            print("Enter Key detected");
            this._translate();
        }
        else if (symbol == Clutter.KEY_Escape){
            this.menu.close();
        }
        else{
            this.sourceText = o.get_text();    
        }
    }
    _translate(){
        print("From : " + this.sourceEntry.get_text());
    }
    create_menu (){

        // Create sub menu from language 
        let sourceLangDropList = new PopupMenu.PopupSubMenuMenuItem('Choose a source language : ');
        
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
        this.sourceEntry = new St.Entry({
                        name: 'searchEntry',
                        style_class: 'translator-text-box',
                        can_focus: true,
                        hint_text: _('Type here to add text for translation..'),
                        track_hover: true, 
                        x_expand: true,
                        y_expand: true,
                        reactive: true,
                        track_hover: false
        });

        let targetEntry = new St.Entry({ name: 'searchEntry',
                        style_class: 'translator-text-box',
                        can_focus: false,
                        hint_text: _('Tranlsated text will show here'),
                        track_hover: false
        });
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        // print(this.sourceEntry.width);
        let _source_clutter_text = this.sourceEntry.get_clutter_text();
        let _target_clutter_text = targetEntry.get_clutter_text();

        _source_clutter_text.set_single_line_mode(false);
        _target_clutter_text.set_single_line_mode(false);

        this.sourceEntry.clutter_text.connect('key-press-event', (o, e) => {
            this._onKeyPressed(o, e);
		});
        // Create sub menu to language 
        let targetLangDropList = new PopupMenu.PopupSubMenuMenuItem('Choose a target language : ');
        let translateSection = new PopupMenu.PopupMenuSection();
        let TImageItem = new PopupMenu.PopupImageMenuItem('translate', 
                'search-high-symbolic')
        translateSection.actor.add_child(TImageItem);

        TImageItem.actor.connect('button-press-event', () => {
            this._translate();
        });

        targetLangDropList.set_track_hover(false);
        sourceLangDropList.set_track_hover(false);
        TImageItem.set_track_hover(false);
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

        let langNames = Utils.namesToView(Translator.getSupportedLangs());
        Array.prototype.forEach.call(langNames, name => {
            
            let sec = new PopupMenu.PopupMenuSection();
            let langItem = new PopupMenu.PopupMenuItem(name);
            sec.actor.add_child(langItem);
            langItem.connect('activate', item => {
                sourceLangDropList.label.set_text("Source Language : " + item.label.get_text());
                this.sourceLang = Utils.getCodeForName(item.label.get_text());
            });
            sourceLangDropList.menu.addMenuItem(sec);

        });
        Array.prototype.forEach.call(langNames, name => {
            
            let sec = new PopupMenu.PopupMenuSection();
            let langItem = new PopupMenu.PopupMenuItem(name);
            sec.actor.add_child(langItem);    
            langItem.connect('activate', item => {
                targetLangDropList.label.set_text("Target Language : " + item.label.get_text());
                this.targetLang = Utils.getCodeForName(item.label.get_text());
            });
            targetLangDropList.menu.addMenuItem(sec);

        });

        

        //let scroll = new St.ScrollView({
        //    style_class: 'translator-text-box'    
        //});
        //let actor = new St.BoxLayout({
        //    reactive: true,
        //    x_expand: true,
        //    y_expand: true,
        //    x_align: St.Align.END,
        //    y_align: St.Align.MIDDLE
        //});
        //actor.add(scroll, {
        //    x_fill: true,
        //    y_fill: true,
        //    expand: true
        //});
        //let entry = new St.Entry({
        //    style_class: 'translator-entry'
        //});

        // Add Everything to Menu 
        this.menu.addMenuItem(sourceLangDropList);
        SourceTextBox.actor.add(this.sourceEntry, { expand: true });
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
