require "kemal"

include Tearbox::HTTPTypes

module Tearbox::Routes
  class StatusRoutes
    property init_time : Int64
    def initialize(@init_time = Time.now.epoch)
    end

    def init_routes
      get "/status" do |env|
        GetStatusResponse.new(STATUS_RUNNING, Time.now.epoch - @init_time).to_json
      end
    end 
  end
end
