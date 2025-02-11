# r = 10
# c = 10
# floors = 8

# # 16 apis on floors 1,3,5,7 at indices
# ap_pos = {1:22,2:27,3:72,4:77,
#           5:222,6:227,7:272,8:277,
#           9:422,10:427,11:472,12:477,
#           13:622,14:627,15:672,16:677}

# cell_signal = {i: [0, 0, 0, 0] for i in range(1, r*c*floors)}

# #  assuming strengths reduce as per euclidean distance, i.e 
# # by -5 for horizontal, vertical and -7 for diagonal

# # for each floor reduces by 15

# # floor1 ----------------------------------------------------
# cell_signal[11] = [95]
# cell_signal[13] = [95]
# cell_signal[15] = [85]
# cell_signal[17] = [75]
# cell_signal[19] = [65]

# cell_signal[20] = [90]
# cell_signal[22] = [100]
# cell_signal[24] = [90]
# cell_signal[26] = [80]
# cell_signal[28] = [70]

# cell_signal[31] = [95]
# cell_signal[33] = [95]
# cell_signal[35] = [85]
# cell_signal[37] = [75]
# cell_signal[39] = [65]

# cell_signal[40] = [90]
# cell_signal[42] = [90]
# cell_signal[44] = [90]
# cell_signal[46] = [80]
# cell_signal[48] = [70]

# cell_signal[51] = [85]
# cell_signal[53] = [85]
# cell_signal[55] = [85]
# cell_signal[57] = [75]
# cell_signal[59] = [65]

# cell_signal[60] = [80]
# cell_signal[62] = [80]
# cell_signal[64] = [80]
# cell_signal[66] = [70]
# cell_signal[68] = [60]

# cell_signal[71] = [75]
# cell_signal[73] = [75]
# cell_signal[75] = [75]
# cell_signal[77] = [65]
# cell_signal[79] = [55]

# cell_signal[80] = [70]
# cell_signal[82] = [70]
# cell_signal[84] = [70]
# cell_signal[86] = [60]
# cell_signal[88] = [50]

# cell_signal[91] = [65]
# cell_signal[93] = [65]
# cell_signal[95] = [65]
# cell_signal[97] = [55]
# cell_signal[99] = [45]


# # floor 2----------------------------------------------------

# cell_signal[111] = [95]
# cell_signal[113] = [95]
# cell_signal[115] = [85]
# cell_signal[117] = [75]
# cell_signal[119] = [65]

# cell_signal[120] = [90]
# cell_signal[122] = [100]
# cell_signal[124] = [90]
# cell_signal[126] = [80]
# cell_signal[128] = [70]

# cell_signal[131] = [95]
# cell_signal[133] = [95]
# cell_signal[135] = [85]
# cell_signal[137] = [75]
# cell_signal[139] = [65]

# cell_signal[140] = [90]
# cell_signal[142] = [90]
# cell_signal[144] = [90]
# cell_signal[146] = [80]
# cell_signal[148] = [70]

# cell_signal[151] = [85]
# cell_signal[153] = [85]
# cell_signal[155] = [85]
# cell_signal[157] = [75]
# cell_signal[159] = [65]

# cell_signal[160] = [80]
# cell_signal[162] = [80]
# cell_signal[164] = [80]
# cell_signal[166] = [70]
# cell_signal[168] = [60]

# cell_signal[171] = [75]
# cell_signal[173] = [75]
# cell_signal[175] = [75]
# cell_signal[177] = [65]
# cell_signal[179] = [55]

# cell_signal[180] = [70]
# cell_signal[182] = [70]
# cell_signal[184] = [70]
# cell_signal[186] = [60]
# cell_signal[188] = [50]

# cell_signal[191] = [65]
# cell_signal[193] = [65]
# cell_signal[195] = [65]
# cell_signal[197] = [55]
# cell_signal[199] = [45]


# # floor 3----------------------------------------------------
# cell_signal[211] = []
# cell_signal[213] = []
# cell_signal[215] = []
# cell_signal[217] = []
# cell_signal[219] = []

# cell_signal[220] = []
# cell_signal[222] = []
# cell_signal[224] = []
# cell_signal[226] = []
# cell_signal[228] = []

# cell_signal[231] = []
# cell_signal[233] = []
# cell_signal[235] = []
# cell_signal[237] = []
# cell_signal[239] = []

# cell_signal[240] = []
# cell_signal[242] = []
# cell_signal[244] = []
# cell_signal[246] = []
# cell_signal[248] = []

# cell_signal[251] = []
# cell_signal[253] = []
# cell_signal[255] = []
# cell_signal[257] = []
# cell_signal[259] = []

# cell_signal[260] = []
# cell_signal[262] = []
# cell_signal[264] = []
# cell_signal[266] = []
# cell_signal[268] = []

# cell_signal[271] = []
# cell_signal[273] = []
# cell_signal[275] = []
# cell_signal[277] = []
# cell_signal[279] = []

# cell_signal[280] = []
# cell_signal[282] = []
# cell_signal[284] = []
# cell_signal[286] = []
# cell_signal[288] = []

# cell_signal[291] = []
# cell_signal[293] = []
# cell_signal[295] = []
# cell_signal[297] = []
# cell_signal[299] = []


# # floor 4 ----------------------------------------------------

# cell_signal[311] = []
# cell_signal[313] = []
# cell_signal[315] = []
# cell_signal[317] = []
# cell_signal[319] = []

# cell_signal[320] = []
# cell_signal[322] = []
# cell_signal[324] = []
# cell_signal[326] = []
# cell_signal[328] = []

# cell_signal[331] = []
# cell_signal[333] = []
# cell_signal[335] = []
# cell_signal[337] = []
# cell_signal[339] = []

# cell_signal[340] = []
# cell_signal[342] = []
# cell_signal[344] = []
# cell_signal[346] = []
# cell_signal[348] = []

# cell_signal[351] = []
# cell_signal[353] = []
# cell_signal[355] = []
# cell_signal[357] = []
# cell_signal[359] = []

# cell_signal[360] = []
# cell_signal[362] = []
# cell_signal[364] = []
# cell_signal[366] = []
# cell_signal[368] = []

# cell_signal[371] = []
# cell_signal[373] = []
# cell_signal[375] = []
# cell_signal[377] = []
# cell_signal[379] = []

# cell_signal[380] = []
# cell_signal[382] = []
# cell_signal[384] = []
# cell_signal[386] = []
# cell_signal[388] = []

# cell_signal[391] = []
# cell_signal[393] = []
# cell_signal[395] = []
# cell_signal[397] = []
# cell_signal[399] = []

# # floor 5 ----------------------------------------------------

# cell_signal[411] = []
# cell_signal[413] = []
# cell_signal[415] = []
# cell_signal[417] = []
# cell_signal[419] = []

# cell_signal[420] = []
# cell_signal[422] = []
# cell_signal[424] = []
# cell_signal[426] = []
# cell_signal[428] = []

# cell_signal[431] = []
# cell_signal[433] = []
# cell_signal[435] = []
# cell_signal[437] = []
# cell_signal[439] = []

# cell_signal[440] = []
# cell_signal[442] = []
# cell_signal[444] = []
# cell_signal[446] = []
# cell_signal[448] = []

# cell_signal[451] = []
# cell_signal[453] = []
# cell_signal[455] = []
# cell_signal[457] = []
# cell_signal[459] = []

# cell_signal[460] = []
# cell_signal[462] = []
# cell_signal[464] = []
# cell_signal[466] = []
# cell_signal[468] = []

# cell_signal[471] = []
# cell_signal[473] = []
# cell_signal[475] = []
# cell_signal[477] = []
# cell_signal[479] = []

# cell_signal[480] = []
# cell_signal[482] = []
# cell_signal[484] = []
# cell_signal[486] = []
# cell_signal[488] = []

# cell_signal[491] = []
# cell_signal[493] = []
# cell_signal[495] = []
# cell_signal[497] = []
# cell_signal[499] = []

# # floor 6 ----------------------------------------------------

# cell_signal[511] = []
# cell_signal[513] = []
# cell_signal[515] = []
# cell_signal[517] = []
# cell_signal[519] = []

# cell_signal[520] = []
# cell_signal[522] = []
# cell_signal[524] = []
# cell_signal[526] = []
# cell_signal[528] = []

# cell_signal[531] = []
# cell_signal[533] = []
# cell_signal[535] = []
# cell_signal[537] = []
# cell_signal[539] = []

# cell_signal[540] = []
# cell_signal[542] = []
# cell_signal[544] = []
# cell_signal[546] = []
# cell_signal[548] = []

# cell_signal[551] = []
# cell_signal[553] = []
# cell_signal[555] = []
# cell_signal[557] = []
# cell_signal[559] = []

# cell_signal[560] = []
# cell_signal[562] = []
# cell_signal[564] = []
# cell_signal[566] = []
# cell_signal[568] = []

# cell_signal[571] = []
# cell_signal[573] = []
# cell_signal[575] = []
# cell_signal[577] = []
# cell_signal[579] = []

# cell_signal[580] = []
# cell_signal[582] = []
# cell_signal[584] = []
# cell_signal[586] = []
# cell_signal[588] = []

# cell_signal[591] = []
# cell_signal[593] = []
# cell_signal[595] = []
# cell_signal[597] = []
# cell_signal[599] = []


# # floor 7 ----------------------------------------------------

# cell_signal[611] = []
# cell_signal[613] = []
# cell_signal[615] = []
# cell_signal[617] = []
# cell_signal[619] = []

# cell_signal[620] = []
# cell_signal[622] = []
# cell_signal[624] = []
# cell_signal[626] = []
# cell_signal[628] = []

# cell_signal[631] = []
# cell_signal[633] = []
# cell_signal[635] = []
# cell_signal[637] = []
# cell_signal[639] = []

# cell_signal[640] = []
# cell_signal[642] = []
# cell_signal[644] = []
# cell_signal[646] = []
# cell_signal[648] = []

# cell_signal[651] = []
# cell_signal[653] = []
# cell_signal[655] = []
# cell_signal[657] = []
# cell_signal[659] = []

# cell_signal[660] = []
# cell_signal[662] = []
# cell_signal[664] = []
# cell_signal[666] = []
# cell_signal[668] = []

# cell_signal[671] = []
# cell_signal[673] = []
# cell_signal[675] = []
# cell_signal[677] = []
# cell_signal[679] = []

# cell_signal[680] = []
# cell_signal[682] = []
# cell_signal[684] = []
# cell_signal[686] = []
# cell_signal[688] = []

# cell_signal[691] = []
# cell_signal[693] = []
# cell_signal[695] = []
# cell_signal[697] = []
# cell_signal[699] = []


# # floor 8 ----------------------------------------------------

# cell_signal[711] = []
# cell_signal[713] = []
# cell_signal[715] = []
# cell_signal[717] = []
# cell_signal[719] = []

# cell_signal[720] = []
# cell_signal[722] = []
# cell_signal[724] = []
# cell_signal[726] = []
# cell_signal[728] = []

# cell_signal[731] = []
# cell_signal[733] = []
# cell_signal[735] = []
# cell_signal[737] = []
# cell_signal[739] = []

# cell_signal[740] = []
# cell_signal[742] = []
# cell_signal[744] = []
# cell_signal[746] = []
# cell_signal[748] = []

# cell_signal[751] = []
# cell_signal[753] = []
# cell_signal[755] = []
# cell_signal[757] = []
# cell_signal[759] = []

# cell_signal[760] = []
# cell_signal[762] = []
# cell_signal[764] = []
# cell_signal[766] = []
# cell_signal[768] = []

# cell_signal[771] = []
# cell_signal[773] = []
# cell_signal[775] = []
# cell_signal[777] = []
# cell_signal[779] = []

# cell_signal[780] = []
# cell_signal[782] = []
# cell_signal[784] = []
# cell_signal[786] = []
# cell_signal[788] = []

# cell_signal[791] = []
# cell_signal[793] = []
# cell_signal[795] = []
# cell_signal[797] = []
# cell_signal[799] = []

