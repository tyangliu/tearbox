require "accord"
require "auto_json"
require "CrystalEmail"
require "hashids"
require "ulid"

##############################################################################
# Data Types
##############################################################################
private macro base
  include AutoJson

  field :id, String?
  field :uid, String, default: ULID.generate
  field :key, String?, json_key: "_key"
  field :created, Time?, default: Time.now, json_converter: Time::Format::ISO_8601_DATE_TIME
  field :modified, Time?, default: Time.now, json_converter: Time::Format::ISO_8601_DATE_TIME

  # Encode and decode _key from/to public facing id.
  macro finished
    def initialize(%pull : ::JSON::PullParser)
      previous_def
      if !@key && (id = @id)
        @key = decode_id id
      elsif !id && (key = @key)
        @id = encode_key key
      end
    end
  end
end

module Tearbox::Types
  private HASH_SALT = "w0w"
  private HASHER = Hashids.new(salt: HASH_SALT, min_length: 8)

  def decode_id(id : String)
    results = HASHER.decode id
    results[0].to_s if results.size > 0
  end

  def encode_key(key : String)
    HASHER.encode [UInt64.new key]
  end

  class JWTToken
    include AutoJson

    field :sub, String
    field :aud, Array(String)
    field :iss, String
    field :exp, Int64
    field :iat, Int64
  end

  enum ItemColor
    Red
    Blue
    Purple
  end 

  enum ItemPiece
    Top
    Bottom
    Gloves
    Shoes
  end

  enum GroupType
    Selling
    Buying
  end

  class Item
    base

    field :color_id, ItemColor
    field :effect_id, UInt32
    field :piece_id, ItemPiece
    field :note, String, default: ""
  end

  class Group
    base

    field :name, String, default: ""
    field :type, GroupType
    field :items, Array(Item), default: [] of Item
  end

  class BoxField
    base

    field :label, String
    field :value, String
  end

  class BoxAuth
    include AutoJson
    include Accord

    field :id, String
    field :passcode, String

    def validate
      errors.add(:id, "ID can't be blank.") if @id.size === 0
      errors.add(:passcode, "Passcode can't be blank") if @passcode.size === 0
    end
  end

  class BoxAuthRefresh
    include AutoJson
    include Accord

    field :id, String
    field :refresh_token, String

    def validate
      errors.add(:id, "ID can't be blank.") if @id.size === 0
      errors.add(:refresh_token, "Refresh token can't be blank") \
        if @refresh_token.size === 0
    end
  end
  
  class BoxData
    base
    include Accord

    field :name, String
    field :description, String, default: ""
    field :passcode, String?
    field :passhash, String?
    field :email, String?
    field :fields, Array(BoxField), default: [] of BoxField
    field :groups, Array(Group), default: [] of Group

    def validate
      errors.add(:name, "Name can't be blank.") if @name.size === 0
      unless passcode = @passcode
        errors.add(:passcode, "Missing passcode.")
      else
        errors.add(:passcode, "Invalid passcode.") \
          unless passcode.size > 0 && passcode.split.size === 1
      end

      puts @email
      errors.add(:email, "Invalid email.") \
        if email && CrystalEmail::Rfc5322.validates? email.not_nil!
    end
  end

  class BoxDataPublic
    base

    field :name, String
    field :description, String, default: ""
    field :fields, Array(BoxField), default: [] of BoxField
    field :groups, Array(Group), default: [] of Group
  end
end


##############################################################################
# Patch Types
##############################################################################
private macro patch_base
  include AutoJson

  field :key, String?, json_key: "_key"
end


module Tearbox::PatchTypes
  class BoxDataPatch
    patch_base

    field :name, String?
    field :description, String?
    field :passcode, String?
    field :email, String?
    field :fields, Array(Tearbox::Types::BoxField)?
    field :groups, Array(Tearbox::Types::Group)?
  end
end

##############################################################################
# HTTP Types
##############################################################################
module Tearbox::HTTPTypes
  include Tearbox::Types
  include Tearbox::PatchTypes

  BAD_REQUEST = 400_i32
  UNAUTHORIZED = 401_i32
  NOT_FOUND = 404_i32

  class ErrorResponse
    include AutoJson

    field :status, Int32, default: 500_i32
    field :message, String, default: ""
    field :errors, Accord::ErrorList?
  end

  class PostBoxAuthResponse
    include AutoJson

    field :token, String
    field :refresh_token, String
    field :expires_at, Int64
  end

  class GetBoxResponse
    include AutoJson

    field :data, BoxDataPublic
  end

  class PostBoxResponse
    include AutoJson

    field :data, BoxDataPublic
    field :token, String
    field :refresh_token, String
    field :expires_at, Int64
  end

  class PatchBoxResponse
    include AutoJson

    field :data, BoxDataPublic
  end

  class DeleteBoxResponse
    include AutoJson

    field :success, Bool
  end
end

##############################################################################
# Arango Types (Response Messages)
##############################################################################
module Tearbox::ArangoTypes
  class Success
    include AutoJson

    field :id, String, json_key: "_id"
    field :key, String, json_key: "_key"
    field :rev, String, json_key: "_rev"
  end

  class UpdateSuccess
    include AutoJson
    
    field :id, String, json_key: "_id"
    field :key, String, json_key: "_key"
    field :rev, String, json_key: "_rev"
    field :old_rev, String, json_key: "_oldRev"
  end

  class Failure
    include AutoJson

    field :error, Bool
    field :message, String, json_key: "errorMessage"
    field :code, Int32
    field :error_num, Int32, json_key: "errorNum"
  end
end

##############################################################################
# Config Types
##############################################################################
module Tearbox::ConfigTypes
  class DatabaseConfig
    include AutoJson

    field :host, String
    field :user, String
    field :pass, String
    field :name, String
  end

  class ServerConfig
    include AutoJson

    field :port, Int32
    field :db, DatabaseConfig
  end
end
