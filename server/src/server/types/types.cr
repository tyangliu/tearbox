require "auto_json"
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

    field :id, String
    field :passcode, String
  end
  
  class BoxData
    base

    field :name, String
    field :description, String, default: ""
    field :passcode, String?
    field :passhash, String?
    field :email, String?
    field :fields, Array(BoxField), default: [] of BoxField
    field :groups, Array(Group), default: [] of Group
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

  class PostBoxAuthResponse
    include AutoJson

    field :token, String
  end

  class GetBoxResponse
    include AutoJson

    field :data, BoxDataPublic
  end

  class PostBoxResponse
    include AutoJson

    field :data, BoxDataPublic
    field :token, String
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
    field :code, UInt16
    field :error_num, UInt64, json_key: "errorNum"
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
