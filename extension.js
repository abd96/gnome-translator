const St         = imports.gi.St; 
const Main       = imports.ui.main;
const GObject    = imports.gi.GObject;
const Gio        = imports.gi.Gio;
const PanelMenu  = imports.ui.panelMenu;
const PopupMenu  = imports.ui.popupMenu;
const Me         = imports.misc.extensionUtils.getCurrentExtension();
const GLib       = imports.gi.GLib; 
const Clutter    = imports.gi.Clutter;
const Extension  = imports.misc.extensionUtils.getCurrentExtension();
const Translator = Extension.imports.translator;
const Utils      = Extension.imports.utils;

const GnomeTranslator = GObject.registerClass(
class GnomeTranslator extends PanelMenu.Button {

    _init(){
        super._init(1);
        let icon = new St.Icon({
            // icon_name : 'security-low-symbolic',
            gicon : Gio.icon_new_for_string( Me.dir.get_path() + '/translate.svg'),
            style_class : 'system-status-icon'
        });
        this.sourceLang  = "en";
        this.targetLang  = "de";
        this.sourceEntry = null;
        this.targetEntry = null;
        this.add_child(icon);
        this.open_close();
        this._sourceText = "";
        this.create_menu(); 
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
        let translationResponse = Translator.translate(this.sourceLang, 
            this.targetLang, this.sourceEntry.get_text() );
        let translatedText = translationResponse.translatedText;
        if(!translatedText){
            this.targetEntry.set_text("");
        }else{
            this.targetEntry.set_text(translationResponse.translatedText);
        }
    }
    create_menu (){
        
        // Create a drop down list for choosing source language
        let sourceLangDropList = new PopupMenu.PopupSubMenuMenuItem('Source Language : ');
        // Create menu item container for source Entry 
        let SourceTextBox = new PopupMenu.PopupBaseMenuItem({
            reactive: false,
            can_focus: false
            
        }); 
        // Create menu item container for target Entry 
        let TargetTextBox = new PopupMenu.PopupBaseMenuItem({
            reactive: false,
            
        }); 
        // Create Source Entry for entering a text for translation 
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
        // Create target entry for showing translation results 
        this.targetEntry = new St.Entry({ name: 'searchEntry',
                        style_class: 'translator-text-box',
                        can_focus: false,
                        hint_text: _('Tranlsated text will show here'),
                        track_hover: false
        });
        // Get Clutter Text from the source and target entries 
        let _source_clutter_text = this.sourceEntry.get_clutter_text();
        let _target_clutter_text = this.targetEntry.get_clutter_text();
        // Set the state for target entry to not editable 
        -_target_clutter_text.set_editable(false);

        // Make Source and Taget entries expandable when entering a multiple lines of text  
        _source_clutter_text.set_single_line_mode(false);
        _target_clutter_text.set_single_line_mode(false);
        // Connect event for key pressing on the source entry 
        this.sourceEntry.clutter_text.connect('key-press-event', (o, e) => {
            this._onKeyPressed(o, e);
		});
        // Create a drop down list for choosing the target language
        
        let targetLangDropList = new PopupMenu.PopupSubMenuMenuItem('Target Language : ');

        // Create section and add a button like object to it so user can click on it for translation 
        let translateSection = new PopupMenu.PopupMenuSection();
        let TImageItem = new PopupMenu.PopupImageMenuItem('translate', 
                'search-high-symbolic')
        translateSection.actor.add_child(TImageItem);
        // Connect event handler for key pressing on translate button 
        TImageItem.actor.connect('button-press-event', () => {
            this._translate();
        });
        
        // dont track hover so you can move cursor while typing  
        targetLangDropList.set_track_hover(false);
        sourceLangDropList.set_track_hover(false);
        TImageItem.set_track_hover(false);
        
        // Add all supported languages to source and target drop down lists 
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
        
        // ADD EVERYTHING 
        this.menu.addMenuItem(sourceLangDropList);
        SourceTextBox.actor.add(this.sourceEntry, { expand: true });
        TargetTextBox.actor.add(this.targetEntry, { expand: true });
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
