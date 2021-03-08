const St = imports.gi.St; 
const Main = imports.ui.main;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const GLib = imports.gi.GLib; 
const Soup = imports.gi.Soup

let myPopup; 

const MyPopup = GObject.registerClass(
class MyPopup extends PanelMenu.Button {

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

    open_close(){
        this.menu.connect('open-state-changed', (menu, open) => {
            if (open){
                // Set default language
                print('opened');
                this.test_translation()
            }
        });
    }

    test_translation(){
        
        
        print("BEOFRE -.................");
        let url = "https://libretranslate.com/translate";
        let request = Soup.Message.new('POST',url);
        let messageBody = Soup.MessageBody.new();
        let body    = messageBody.append(
            JSON.stringify({
                q: "Hello",
                source: "en",
                target: "es"
            })
        );
        let messageHeader = Soup.MessageHeaders.new(
            Soup.MessageHeadersType.REQUEST
        );
        
        let _SESSION = null;
        _SESSION = new Soup.SessionAsync();
        Soup.Session.prototype.add_feature.call(
            _SESSION, 
            new Soup.ProxyResolverDefault()
        );
        _SESSION.queue_message(request, 

        (http_session, message) => {
            print(message.status_code)
            print(message) 
        }


        )
        print(_SESSION)
        print("NO ERRORS ? ")
        print("AFTER --------............")
    }

    create_menu (){

        //let pmItem = new PopupMenu.PopupMenuItem("First Item ");
        //this.menu.addMenuItem(pmItem);

        // Create sub menu from language 
        let fromSubItem = new PopupMenu.PopupSubMenuMenuItem('From language');
        this.menu.addMenuItem(fromSubItem);
        

        // Create text entry for fromSubItem 
        let fromEntryItem  = new PopupMenu.PopupBaseMenuItem({
            reactive: false,
            can_focus: false
            
        }); 

        let toEntryItem  = new PopupMenu.PopupBaseMenuItem({
            reactive: false,
            
        }); 

        let fromSearchEntry = new St.Entry({
                        name: 'searchEntry',
                        style_class: 'search-entry',
                        can_focus: true,
                        hint_text: _('Type here to add text for translation..'),
                        track_hover: true
        });

        let toSearchEntry = new St.Entry({
                        name: 'searchEntry',
                        style_class: 'search-entry',
                        can_focus: true,
                        hint_text: _('Tranlsated text will show here'),
                        track_hover: true
        });

        fromEntryItem.actor.add(fromSearchEntry, { expand: true });
        toEntryItem.actor.add(toSearchEntry, { expand: true });
        this.menu.addMenuItem(fromEntryItem);

        // Create sub menu to language 
        let toSubItem = new PopupMenu.PopupSubMenuMenuItem('To language');
        this.menu.addMenuItem(toSubItem); // add the "to" item list 
        this.menu.addMenuItem(toEntryItem);  // add item for translated text 
    } 
}
);

let panelButton, panelButtonText; 


function init (){
    

}

function enable (){
    myPopup = new MyPopup();
    Main.panel.addToStatusArea('mypopup', myPopup, 1);
    // Main.panel._rightBox.insert_child_at_index(panelButton, 1);
}

function disable (){
    Main.panel._rightBox.remove_child(panelButton);
}
