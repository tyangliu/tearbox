require "crypto/bcrypt/password"
require "jwt"
require "random/secure"

require "./types"

module Tearbox
  include Tearbox::Types
  include Tearbox::ConfigTypes

  class Hasher
    @@id_key : String = ""
    @@hash_encoder : Hashids = Hashids.new

    def initialize(config : ServerConfig)
      @@id_key = config.auth.id_key
      @@hash_encoder = Hashids.new(salt: @@id_key, min_length: 8)
    end

    def self.decode_id(id : String)
      results = @@hash_encoder.decode id
      results[0].to_s if results.size > 0
    end

    def self.encode_key(key : String)
      @@hash_encoder.encode [UInt64.new key]
    end
  end

  class Auth
    @@secret_key : String = ""
    @@pass_cost : Int32 = 6

    def initialize(config : ServerConfig)
      @@secret_key = config.not_nil!.auth.token_key
      @@pass_cost = config.not_nil!.auth.pass_cost
    end

    def self.create_passhash(passcode : String) : String
      Crypto::Bcrypt::Password.create(
        passcode,
        cost: @@pass_cost,
      ).to_s
    end

    def self.validate_passhash(passcode : String, passhash : String) : Bool
      Crypto::Bcrypt::Password.new(passhash) == passcode
    end

    def self.create_token(
      sub : String,
      aud : String,
      exp : Int64,
    ) : String
      payload = JWTToken.new(
        sub: sub,
        aud: [aud],
        iss: "Tearbox-Server",
        exp: exp,
        iat: Time.now.epoch,
      )
      JWT.encode(payload, @@secret_key, "HS256")
    end

    def self.validate_token(
      token : String,
      sub : String,
      aud : String,
    )
      JWT.decode(
        token,
        @@secret_key,
        "HS256",
        sub: sub,
        aud: aud,
        iss: "Tearbox-Server",
      )   
    end
  end
end
