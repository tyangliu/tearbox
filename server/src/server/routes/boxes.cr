require "arangocr"
require "kemal"

require "../auth";

include Tearbox::Types
include Tearbox::PatchTypes
include Tearbox::HTTPTypes
include Tearbox::ArangoTypes

include Tearbox::Auth

macro error_resp(status = BAD_REQUEST, message = nil, errors = nil)
  resp = ErrorResponse.new(
    status: {{status}},
    message: {{message}},
    errors: {{errors}},
  )
  halt env, status_code: {{status}}, response: resp.to_json
end

module Tearbox::Routes
  TOKEN_HEADER = "X-Token"

  AUTH_SUB = "boxes/auth"
  REFR_SUB = "boxes/refresh"

  NOT_FOUND_MSG = "The box does not exist."
  INVALID_PASSCODE_MSG = "Invalid passcode."
  MISSING_TOKEN_MSG = "Missing authorization token."
  INVALID_TOKEN_MSG = "Invalid authorization token."

  def create_tokens(id : String) 
    token_exp = Time.now.epoch + 3600 * 24 * 7
    token = create_token(
      sub: AUTH_SUB,
      aud: id,
      exp: token_exp,
    )
    refresh_token = create_token(
      sub: REFR_SUB,
      aud: id,
      exp: token_exp,
    )
    {token_exp, token, refresh_token}
  end

  def init_boxes_routes(database : Arango::Database)
    boxes = database.collection("boxes")

    ######################################################
    # Auth
    ######################################################
    post "/boxes/auth" do |env|
      unless req_body = env.request.body
        error_resp BAD_REQUEST
      end

      begin
        auth_data = BoxAuth.from_json req_body  
      rescue
        error_resp BAD_REQUEST
      end

      unless key = decode_id auth_data.id 
        error_resp BAD_REQUEST
      end

      db_resp = boxes.document.get key

      unless db_resp.success?
        raise db_resp.body
      end

      data = BoxData.from_json db_resp.body
      unless validate_passhash(auth_data.passcode, data.passhash.not_nil!)
        error_resp(UNAUTHORIZED, INVALID_PASSCODE_MSG)
      end

      exp, token, refresh_token = create_tokens(data.id.not_nil!)
      PostBoxAuthResponse.new(token, refresh_token, exp).to_json
    rescue
      error_resp BAD_REQUEST
    end
  
    ######################################################
    # Refresh Auth
    ######################################################
    post "/boxes/refresh" do |env|
      unless req_body = env.request.body
        error_resp BAD_REQUEST
      end

      begin
        auth_data = BoxAuthRefresh.from_json req_body  
      rescue
        error_resp BAD_REQUEST
      end

      unless (id = auth_data.id) && (token = auth_data.refresh_token)
        error_resp BAD_REQUEST
      end

      begin
        validate_token(
          auth_data.refresh_token,
          sub: REFR_SUB,
          aud: id
        )
      rescue
        error_resp(UNAUTHORIZED, INVALID_TOKEN_MSG)
      end

      exp, token, refresh_token = create_tokens(id)
      PostBoxAuthResponse.new(token, refresh_token, exp).to_json
    rescue
      error_resp BAD_REQUEST
    end

    ######################################################
    # Get Box
    ######################################################
    get "/boxes/:id" do |env|
      id = env.params.url["id"]
      unless key = decode_id id
        error_resp(NOT_FOUND, NOT_FOUND_MSG)
      end

      db_resp = boxes.document.get key

      unless db_resp.success?
        raise db_resp.body
      end

      data = BoxDataPublic.from_json db_resp.body
      GetBoxResponse.new(data).to_json
    end

    ######################################################
    # Opts Box
    ######################################################
    options "/boxes" do |env|
    end

    ######################################################
    # Post Box
    ######################################################
    post "/boxes" do |env|
      unless req_body = env.request.body
        error_resp BAD_REQUEST
      end
      
      begin
        data = BoxData.from_json req_body  
      rescue
        error_resp BAD_REQUEST
      end

      data.validate!
      unless data.valid? 
        error_resp(BAD_REQUEST, errors: data.errors)
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
      
      exp, token, refresh_token = create_tokens(data.id.not_nil!)
      PostBoxResponse.new(data, token, refresh_token, exp).to_json
    rescue
      error_resp BAD_REQUEST
    end

    ######################################################
    # Opts Box Id
    ######################################################
    options "/boxes/:id" do |env|
    end

    ######################################################
    # Patch Box
    ######################################################
    patch "/boxes/:id" do |env|
      id = env.params.url["id"]
      unless key = decode_id id
        error_resp(NOT_FOUND, NOT_FOUND_MSG)
      end

      unless req_body = env.request.body
        error_resp BAD_REQUEST
      end

      unless token = env.request.headers[TOKEN_HEADER]?
        error_resp(UNAUTHORIZED, MISSING_TOKEN_MSG)
      end

      begin
        validate_token(token, sub: AUTH_SUB, aud: id)
      rescue
        error_resp(UNAUTHORIZED, INVALID_TOKEN_MSG)
      end

      begin
        patch_data = BoxDataPatch.from_json req_body
      rescue
        error_resp BAD_REQUEST
      end

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
      error_resp BAD_REQUEST
    end

    ######################################################
    # Delete Box
    ######################################################
    delete "/boxes/:id" do |env|
      id = env.params.url["id"]
      unless key = decode_id id
        error_resp(NOT_FOUND, NOT_FOUND_MSG)
      end

      unless req_body = env.request.body
        error_resp BAD_REQUEST
      end

      unless token = env.request.headers[TOKEN_HEADER]?
        error_resp(UNAUTHORIZED, MISSING_TOKEN_MSG)
      end

      begin
        validate_token(token, sub: AUTH_SUB, aud: id)
      rescue
        error_resp(UNAUTHORIZED, INVALID_TOKEN_MSG)
      end

      db_resp = boxes.document.delete key
      unless db_resp.success?
        raise db_resp.body
      end
      DeleteBoxResponse.new(true).to_json
    rescue
      error_resp BAD_REQUEST
    end
  end

end
