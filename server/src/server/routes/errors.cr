require "kemal"

module Tearbox::Routes
  def init_errors
    error 404 do |context, exception|
      context.response.status_code = 404
      context
    end

    error 500 do |context, exception|
      puts exception
      context.response.status_code = 500
      context
    end
  end
end
