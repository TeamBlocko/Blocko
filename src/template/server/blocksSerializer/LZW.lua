local LZW = {}

local encodeDict = {}
local decodeDict = {}

local numericEncodingChars = {}

do
    local c = 33
    for i = 0, 99 do
        if c == string.byte("-") then
            c = c + 1 -- skip "-", it is allocated as a lzw encoding delimiter
        end

        numericEncodingChars[i] = string.char(c)

        c = c + 1
    end
end

for i, c in pairs(numericEncodingChars) do
    encodeDict[i] = c
    decodeDict[c] = i
end


local function getdict(isEncode)
    local dict = {}

    local s = " !#$%&'\"()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
    local len = string.len(s)

    for i = 1, len do
        if isEncode then
            dict[string.sub(s, i, i)] = i
        else
            dict[i] = string.sub(s, i, i)
        end
    end

    return dict, len
end


local function getEncodedDictCode(code)
    local encodedDictCode = {}

    local nums = ""
    for n in string.gmatch(tostring(code), "%d") do
        local temp = nums .. n

        if (string.sub(temp, 1, 1) ~= "0") and encodeDict[tonumber(temp)] then
            nums = temp
        else
            encodedDictCode[#encodedDictCode + 1] = encodeDict[tonumber(nums)]
            nums = n
        end
    end
    encodedDictCode[#encodedDictCode + 1] = encodeDict[tonumber(nums)]

    return table.concat(encodedDictCode)
end

local function encodeDictCodes(codes)
    local translated = {}

    for i, code in pairs(codes) do
        translated[i] = getEncodedDictCode(code)
    end

    return translated
end

local function decodeDictCodes(codes)
    local translated = {}

    for i, code in pairs(codes) do
        translated[i] = ""

        for c in string.gmatch(code, ".") do
            translated[i] = translated[i] .. decodeDict[c]
        end

        translated[i] = tonumber(translated[i])
    end

    return translated
end


function LZW:Compress(text, disableExtraEncoding)
    local s = ""
    local ch

    local data = text

    local dlen = string.len(data)
    local result = {}

    local dict, len = getdict(true)
    local temp

    for i = 1, dlen do
        ch = string.sub(data, i, i)
        temp = s .. ch
        if dict[temp] then
            s = temp
        else
            result[#result + 1] = dict[s]
            len = len + 1
            dict[temp] = len
            s = ch
        end
    end

    result[#result + 1] = dict[s]

    if not disableExtraEncoding then
        result = encodeDictCodes(result)
    end

    return table.concat(result, "-")
end

function LZW:Decompress(text, disableExtraEncoding)
    local dict, _len = getdict(false)

    local entry
    local ch
    local prevCode, currCode

    local result = {}

    local data = {}
    for c in string.gmatch(text, '([^%-]+)') do
        data[#data + 1] = c
    end

    if not disableExtraEncoding then
        data = decodeDictCodes(data)
    end

    prevCode = data[1]
    result[#result + 1] = dict[prevCode]

    for i = 2, #data do
        currCode = data[i]
        entry = dict[currCode]

        if entry then
            ch = string.sub(entry, 1, 1)
            result[#result + 1] = entry
        else
            ch = string.sub(dict[prevCode], 1, 1)
            result[#result + 1] = dict[prevCode] .. ch
        end

        dict[#dict + 1] = dict[prevCode] .. ch

        prevCode = currCode
    end

    return table.concat(result)
end


return LZW