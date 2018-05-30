require "arangocr"
require "auto_json"
require "kemal"

require "./server/types"
require "./server/routes/*"

include Tearbox::ConfigTypes

DB_HOST = "http://127.0.0.1:8529"
DB_USER = "root"
DB_PASS = ""
DB_NAME = "tearbox"

config = ServerConfig.new(
  port: 3000,
  db: DatabaseConfig.new(
    host: DB_HOST,
    user: DB_USER,
    pass: DB_PASS,
    name: DB_NAME,
  ), 
)

module Tearbox
  class Server
    include Tearbox::Routes

    @database : Arango::Database

    def initialize(@config : ServerConfig)
      @db_client = Arango::Client.new(@config.db.host, @config.db.user, @config.db.pass)
      @database = @db_client.database(@config.db.name)

      init_errors
      init_boxes_routes(@database)
    end

    def run
      serve_static false
      Kemal.run(@config.port)
    end
  end
end

Tearbox::Server.new(config).run
