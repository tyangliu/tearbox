require "arangocr"
require "kemal"

require "../auth";

include Tearbox::Types
include Tearbox::PatchTypes
include Tearbox::HTTPTypes
include Tearbox::ArangoTypes

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


  class BoxesRoutes
    property config : ServerConfig
    property db_client : Arango::Client
    property database : Arango::Database
    property boxes : Arango::Collection

    def initialize(
      @config : ServerConfig,
      @db_client : Arango::Client,
      @database : Arango::Database,
    )
      @boxes = database.collection("boxes")
    end

    def init_db
      @db_client = Arango::Client.new(@config.db.host, @config.db.user, @config.db.pass)
      @database = @db_client.database(@config.db.name)
      @boxes = database.collection("boxes")
    end

    def create_tokens(id : String)
      token_exp = Time.now.epoch + 3600 * 24 * 7
      token = Auth.create_token(
        sub: AUTH_SUB,
        aud: id,
        exp: token_exp,
      )
      refresh_token = Auth.create_token(
        sub: REFR_SUB,
        aud: id,
        exp: token_exp,
      )
      {token_exp, token, refresh_token}
    end

    def init_routes
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

        unless key = Hasher.decode_id auth_data.id 
          error_resp BAD_REQUEST
        end

        db_resp = boxes.document.get key

        unless db_resp.success?
          init_db
          raise db_resp.body
        end

        data = BoxData.from_json db_resp.body
        unless Auth.validate_passhash(auth_data.passcode, data.passhash.not_nil!)
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
          Auth.validate_token(
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
        unless key = Hasher.decode_id id
          error_resp(NOT_FOUND, NOT_FOUND_MSG)
        end

        db_resp = boxes.document.get key

        unless db_resp.success?
          init_db
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

        data.passhash = Auth.create_passhash(data.passcode.not_nil!)
        data.passcode = nil

        db_resp = boxes.document.create data
        unless db_resp.success?
          init_db
          raise db_resp.body
        end

        key = (Success.from_json db_resp.body).key

        db_resp = boxes.document.get key
        unless db_resp.success?
          init_db
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
        unless key = Hasher.decode_id id
          error_resp(NOT_FOUND, NOT_FOUND_MSG)
        end

        unless req_body = env.request.body
          error_resp BAD_REQUEST
        end

        unless token = env.request.headers[TOKEN_HEADER]?
          error_resp(UNAUTHORIZED, MISSING_TOKEN_MSG)
        end

        begin
          Auth.validate_token(token, sub: AUTH_SUB, aud: id)
        rescue
          error_resp(UNAUTHORIZED, INVALID_TOKEN_MSG)
        end

        begin
          patch_data = BoxDataPatch.from_json req_body
        rescue
          error_resp BAD_REQUEST
        end
        patch_data.passhash = nil

        # Handle passcode change.
        if (old = patch_data.old_passcode) && (new = patch_data.passcode) 
          db_resp = boxes.document.get key

          unless db_resp.success?
            raise db_resp.body
          end

          data = BoxData.from_json db_resp.body
          unless Auth.validate_passhash(old, data.passhash.not_nil!)
            error_resp(FORBIDDEN, INVALID_PASSCODE_MSG)
          end
   
          patch_data.passhash = Auth.create_passhash new
        end
        patch_data.old_passcode = nil
        patch_data.passcode = nil

        db_resp = boxes.document.update(key, patch_data)
        unless db_resp.success?
          init_db
          raise db_resp.body
        end

        db_resp = boxes.document.get key
        unless db_resp.success?
          init_db
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
        unless key = Hasher.decode_id id
          error_resp(NOT_FOUND, NOT_FOUND_MSG)
        end

        unless req_body = env.request.body
          error_resp BAD_REQUEST
        end

        unless token = env.request.headers[TOKEN_HEADER]?
          error_resp(UNAUTHORIZED, MISSING_TOKEN_MSG)
        end

        begin
          Auth.validate_token(token, sub: AUTH_SUB, aud: id)
        rescue
          error_resp(UNAUTHORIZED, INVALID_TOKEN_MSG)
        end

        db_resp = boxes.document.delete key
        unless db_resp.success?
          init_db
          raise db_resp.body
        end
        DeleteBoxResponse.new(true).to_json
      rescue
        error_resp BAD_REQUEST
      end
    end
  end
end
