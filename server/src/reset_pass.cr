require "arangocr"
require "option_parser"

require "./server/types"
require "./server/auth"

include Tearbox
include Tearbox::ConfigTypes

DEFAULT_CONFIG_PATH= "config/config_dev.json"

def reset_pass(config : ServerConfig, id : String, passcode : String)
  db_client = Arango::Client.new(config.db.host, config.db.user, config.db.pass)
  database = db_client.database(config.db.name)
  boxes = database.collection("boxes")

  Auth.new config
  Hasher.new config

  unless key = Hasher.decode_id id
    puts "Invalid id"
    return
  end

    db_resp = boxes.document.get key

  unless db_resp.success?
    puts "DB failure"
    return
  end

  data = BoxData.from_json db_resp.body
  data.passhash = Auth.create_passhash passcode

  db_resp = boxes.document.update(key, data)
  unless db_resp.success?
    puts "DB failure update"
    return
  end

  puts "Changed password successfully"
end

config_path = DEFAULT_CONFIG_PATH
box_id = nil
passcode = nil

OptionParser.parse! do |parser|
  parser.banner = "Usage: server [arguments]"
  parser.on("-c PATH", "--config=PATH", "config path") { |path|
    config_path = path
  }
  parser.on("-i ID", "--id=ID", "box id") { |id|
    box_id = id
  }
  parser.on("-p PASS", "--passcode=PASS", "new passcode") { |pass|
    passcode = pass
  }
end

config_str = File.read(config_path)
config = ServerConfig.from_json config_str
reset_pass(config, box_id.not_nil!, passcode.not_nil!)
