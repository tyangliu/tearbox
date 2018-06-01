require "kemal"

module Tearbox::Routes
  def init_errors
    error 404 do |context, exception|
      context.response.status_code = 404
      NamedTuple.new.to_json
    end

    error 500 do |context, exception|
      puts exception
      context.response.status_code = 500
      NamedTuple.new.to_json
    end
  end
end
