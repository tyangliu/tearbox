require "arangocr"
require "kemal"
require "option_parser"

require "./server/types"
require "./server/routes/*"

include Tearbox::ConfigTypes

DEFAULT_CONFIG_PATH= "config/config_dev.json"

module Tearbox
  class Server
    include Tearbox::Routes

    @database : Arango::Database

    def initialize(@config : ServerConfig)
      Auth.new @config
      Hasher.new @config

      @db_client = Arango::Client.new(@config.db.host, @config.db.user, @config.db.pass)
      @database = @db_client.database(@config.db.name)

      init_errors
      BoxesRoutes.new(@config, @db_client, @database).init_routes
    end

    def run
      serve_static false
      Kemal.run(@config.port)
    end
  end
end

config_path = DEFAULT_CONFIG_PATH
OptionParser.parse! do |parser|
  parser.banner = "Usage: server [arguments]"
  parser.on("-c PATH", "--config=PATH", "config path") { |path|
    config_path = path
  }
end

config_str = File.read(config_path)
config = ServerConfig.from_json config_str
Tearbox::Server.new(config).run
