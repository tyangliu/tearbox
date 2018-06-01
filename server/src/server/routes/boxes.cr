require "arangocr"
require "kemal"

require "../auth";

include Tearbox::Types
include Tearbox::PatchTypes
include Tearbox::HTTPTypes
include Tearbox::ArangoTypes

include Tearbox::Auth

module Tearbox::Routes
  def init_boxes_routes(database : Arango::Database)
    boxes = database.collection("boxes")

    post "/boxes/auth" do |env|
      unless req_body = env.request.body
        resp = ErrorResponse.new(status: BAD_REQUEST)
        halt env, status_code: BAD_REQUEST, response: resp.to_json
      end

      auth_data = BoxAuth.from_json req_body  
      unless key = decode_id auth_data.id 
        resp = ErrorResponse.new(status: BAD_REQUEST)
        halt env, status_code: BAD_REQUEST, response: resp.to_json
      end

      db_resp = boxes.document.get key

      unless db_resp.success?
        raise db_resp.body
      end

      data = BoxData.from_json db_resp.body
      unless validate_passhash(auth_data.passcode, data.passhash.not_nil!)
        resp = ErrorResponse.new(
          status: UNAUTHORIZED,
          message: "Invalid passcode.",
        )
        halt env, status_code: UNAUTHORIZED, response: resp.to_json
      end

      token = create_token(
        sub: "boxes",
        aud: data.id.not_nil!,
      )

      PostBoxAuthResponse.new(token).to_json
    rescue
      resp = ErrorResponse.new(status: BAD_REQUEST)
      halt env, status_code: BAD_REQUEST, response: resp.to_json
    end

    get "/boxes/:id" do |env|
      id = env.params.url["id"]
      unless key = decode_id id
        resp = ErrorResponse.new(
          status: NOT_FOUND,
          message: "The box does not exist.",
        )
        halt env, status_code: NOT_FOUND, response: resp.to_json
      end

      db_resp = boxes.document.get key

      unless db_resp.success?
        raise db_resp.body
      end

      data = BoxDataPublic.from_json db_resp.body
      GetBoxResponse.new(data).to_json
    end

    options "/boxes" do |env|
    end

    post "/boxes" do |env|
      unless req_body = env.request.body
        resp = ErrorResponse.new(status: BAD_REQUEST)
        halt env, status_code: BAD_REQUEST, response: resp.to_json
      end
      
      data = BoxData.from_json req_body  
      data.validate!
      unless data.valid? 
        resp = ErrorResponse.new(status: BAD_REQUEST, errors: data.errors)
        halt env, status_code: BAD_REQUEST, response: resp.to_json
      end

      data.passhash = create_passhash(data.passcode.not_nil!)

      db_resp = boxes.document.create data
      unless db_resp.success?
        raise db_resp.body
      end

      key = (Success.from_json db_resp.body).key

      db_resp = boxes.document.get key
      unless db_resp.success?
        raise db_resp.body
      end

      data = BoxDataPublic.from_json db_resp.body
      token = create_token(
        sub: "boxes",
        aud: data.id.not_nil!,
      )

      PostBoxResponse.new(data, token).to_json
    rescue
      resp = ErrorResponse.new(status: BAD_REQUEST)
      halt env, status_code: BAD_REQUEST, response: resp.to_json
    end

    options "/boxes/:id" do |env|
    end

    patch "/boxes/:id" do |env|
      id = env.params.url["id"]
      unless key = decode_id id
        resp = ErrorResponse.new(
          status: NOT_FOUND,
          message: "The box does not exist.",
        )
        halt env, status_code: NOT_FOUND, response: resp.to_json
      end

      unless req_body = env.request.body
        resp = ErrorResponse.new(status: BAD_REQUEST)
        halt env, status_code: BAD_REQUEST, response: resp.to_json
      end

      unless token = env.request.headers["X-Token"]?
        resp = ErrorResponse.new(
          status: UNAUTHORIZED,
          message: "Missing authorization token.",
        )
        halt env, status_code: UNAUTHORIZED, response: resp.to_json
      end

      begin
        validate_token(token, sub: "boxes", aud: id)
      rescue
        resp = ErrorResponse.new(
          status: UNAUTHORIZED,
          message: "Invalid authorization token.",
        )
        halt env, status_code: UNAUTHORIZED, response: resp.to_json
      end

      patch_data = BoxDataPatch.from_json req_body

      db_resp = boxes.document.update(key, patch_data)
      unless db_resp.success?
        raise db_resp.body
      end

      db_resp = boxes.document.get key
      unless db_resp.success?
        raise db_resp.body
      end

      data = BoxDataPublic.from_json db_resp.body
      PatchBoxResponse.new(data).to_json
    rescue
      resp = ErrorResponse.new(status: BAD_REQUEST)
      halt env, status_code: BAD_REQUEST, response: resp.to_json
    end

    delete "/boxes/:id" do |env|
      id = env.params.url["id"]
      unless key = decode_id id
        resp = ErrorResponse.new(
          status: NOT_FOUND,
          message: "The box does not exist.",
        )
        halt env, status_code: NOT_FOUND, response: resp.to_json
      end

      unless req_body = env.request.body
        resp = ErrorResponse.new(status: BAD_REQUEST)
        halt env, status_code: BAD_REQUEST, response: resp.to_json
      end

      unless token = env.request.headers["X-Token"]?
        resp = ErrorResponse.new(
          status: UNAUTHORIZED,
          message: "Missing authorization token.",
        )
        halt env, status_code: UNAUTHORIZED, response: resp.to_json
      end

      begin
        validate_token(token, sub: "boxes", aud: id)
      rescue
        resp = ErrorResponse.new(
          status: UNAUTHORIZED,
          message: "Invalid authorization token.",
        )
        halt env, status_code: UNAUTHORIZED, response: resp.to_json
      end

      db_resp = boxes.document.delete key
      unless db_resp.success?
        raise db_resp.body
      end
      DeleteBoxResponse.new(true).to_json
    rescue
      resp = ErrorResponse.new(status: BAD_REQUEST)
      halt env, status_code: BAD_REQUEST, response: resp.to_json
    end
  end

end
