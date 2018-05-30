require "auto_json"
require "hashids"
require "ulid"

macro hide_fields(fields, from obj, run)
  {% for field, index in fields %}
    %field{index}, {{obj}}.{{field}} = {{obj}}.{{field}}, nil    
  {% end %}
  %result = {{run}}
  {% for field, index in fields %} 
    {{obj}}.{{field}} = %field{index}
  {% end %}
  %result
end

macro base
  include AutoJson

  field :id, String?
  field :uid, String, default: ULID.generate
  field :key, String?, json_key: "_key"

  # Encode and decode _key from/to public facing id.
  macro finished
    def initialize(%pull : ::JSON::PullParser)
      previous_def
      if !@key && (id = @id)
        @key = decode_id id
      end
    end

    def to_json(json : JSON::Builder)
      if !@id && (key = @key)
        @id = encode_key key
      end
      previous_def
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
    field :created, Time?
    field :modified, Time?
  end

  class Group
    base

    field :name, String, default: ""
    field :type, GroupType
    field :description, String, default: ""
    field :items, Array(Item), default: [] of Item
    field :created, Time?
    field :modified, Time?
  end

  class BoxField
    base

    field :label, String
    field :value, String
  end
  
  class BoxData
    base

    field :name, String
    field :passcode, String?
    field :passhash, String?
    field :email, String?
    field :fields, Array(BoxField), default: [] of BoxField
    field :groups, Array(Group), default: [] of Group
    field :created, Time?
    field :modified, Time?

    def to_json_public
      hide_fields [passcode, passhash, email], from: self, run: to_json
    end
  end
end

module Tearbox::ArangoTypes
  class CreateSuccess
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
end
