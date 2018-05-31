require "arangocr"
require "kemal"

include Tearbox::Types
include Tearbox::PatchTypes
include Tearbox::ArangoTypes

module Tearbox::Routes
  def init_boxes_routes(database : Arango::Database)
    boxes = database.collection("boxes")

    get "/boxes/:id" do |env|
      unless key = decode_id env.params.url["id"]
        raise "ID not found"
      end

      db_resp = boxes.document.get key

      unless db_resp.success?
        raise "Temp"
      end

      data = BoxData.from_json db_resp.body
      data.to_json_public
    end

    options "/boxes" do |env|
    end

    post "/boxes" do |env|
      unless req_body = env.request.body
        raise "Invalid body"
      end
      
      data = BoxData.from_json req_body  

      db_resp = boxes.document.create data
      unless db_resp.success?
        raise "Temp"
      end

      key = (Success.from_json db_resp.body).key

      db_resp = boxes.document.get key
      unless db_resp.success?
        raise "Temp"
      end

      data = BoxData.from_json db_resp.body
      data.to_json_public 
    end

    options "/boxes/:id" do |env|
    end

    patch "/boxes/:id" do |env|
      unless key = decode_id env.params.url["id"]
        raise "ID not found"
      end

      unless req_body = env.request.body
        raise "Invalid body"
      end

      patch_data = BoxDataPatch.from_json req_body

      db_resp = boxes.document.update(key, patch_data)
      unless db_resp.success?
        raise "Temp"
      end

      db_resp = boxes.document.get key
      unless db_resp.success?
        raise "Temp"
      end

      data = BoxData.from_json db_resp.body
      data.to_json_public 
    end

    delete "/boxes/:id" do |env|
      unless key = decode_id env.params.url["id"]
        raise "ID not found"
      end

      db_resp = boxes.document.delete key
      unless db_resp.success?
        raise "Temp"
      end
    end
  end
end
