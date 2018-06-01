require "crypto/bcrypt/password"
require "jwt"
require "random/secure"

require "./types"

module Tearbox::Auth
  include Tearbox::Types

  private SECRET_KEY = "TEST"
  private PASS_COST = 10

  def create_passhash(passcode : String) : String
    Crypto::Bcrypt::Password.create(passcode, cost: PASS_COST).to_s
  end

  def validate_passhash(passcode : String, passhash : String) : Bool
    Crypto::Bcrypt::Password.new(passhash) == passcode
  end

  def create_token(
    sub : String,
    aud : String,
    exp : Int64 = 3600_i64,
  ) : String
    now = Time.now.epoch
    payload = JWTToken.new(
      sub: sub,
      aud: [aud],
      iss: "Tearbox-Server",
      exp: now + exp,
      iat: now,
    )
    JWT.encode(payload, SECRET_KEY, "HS256")
  end

  def validate_token(
    token : String,
    sub : String,
    aud : String,
  )
    JWT.decode(
      token,
      SECRET_KEY,
      "HS256",
      sub: sub,
      aud: aud,
      iss: "Tearbox-Server",
    )   
  end
end
