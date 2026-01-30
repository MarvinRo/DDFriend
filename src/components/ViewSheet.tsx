import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, useWindowDimensions, Modal } from 'react-native';

// Definição das Props (Mantive a sua estrutura original)
type ViewSheetProps = {
    initialData: {
        modCharisma: number;
        modWisdom: number;
        modIntelligence: number;
        modConstitution: number;
        modStrength: number;
        life: string;
        characterRace: string;
        characterName: string;
        characterClass: string;
        level: number;
        characterAntecedent: string;
        characterTrend: string;
        experience: number;
        strength: number;
        wisdom: number;
        charisma: number;
        intelligence: number;
        constitution: number;
        dexterity: number;
        modDexterity: number
        platina: number;
        gold: number;
        electrum: number;
        silver: number;
        copper: number;
        armor: number;
        movement: number;
        efficiencyBonus: number;
        selectedSkills: string[];
        selectedSafeguards: string[];
    }
    initialBag: {
        platina: number;
        gold: number;
        electrum: number;
        silver: number;
        copper: number;
        armor: number;
        items: string;
    }
    userInfo: { _user: { displayName: string } }
    onClose: () => void;
};

export default function DnDCharacterSheet(props: ViewSheetProps) {
    const { width } = useWindowDimensions();
    const [currentPage, setCurrentPage] = useState(1);
    const isSmall = false;

    // Estados locais para interatividade
    const [selectedSkills, setSelectedSkills] = useState<string[]>(props.initialData.selectedSkills || []);
    const [selectedSafeguards, setSelectedSafeguards] = useState<string[]>(props.initialData.selectedSafeguards || []);

    const [character] = useState({
        proficiencyBonus: props.initialData.efficiencyBonus || 2,
    });

    // Funções auxiliares
    const calculateModifier = (score: number) => Math.floor((score - 10) / 2);
    const formatModifier = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`);

    const [leftColHeight, setLeftColHeight] = useState(0);

    const onLeftColLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setLeftColHeight(height);
    };

    // Dados
    const attributes = [
        { key: 'strength', label: 'FORÇA', value: props.initialData.strength },
        { key: 'dexterity', label: 'DESTREZA', value: props.initialData.dexterity },
        { key: 'constitution', label: 'CONSTITUIÇÃO', value: props.initialData.constitution },
        { key: 'intelligence', label: 'INTELIGÊNCIA', value: props.initialData.intelligence },
        { key: 'wisdom', label: 'SABEDORIA', value: props.initialData.wisdom },
        { key: 'charisma', label: 'CARISMA', value: props.initialData.charisma },
    ];

    const skills = [
        { key: 'Acrobacia', label: 'Acrobacia (Des)', score: props.initialData.dexterity },
        { key: 'Arcanismo', label: 'Arcanismo (Int)', score: props.initialData.intelligence },
        { key: 'Atletismo', label: 'Atletismo (For)', score: props.initialData.strength },
        { key: 'Atuação', label: 'Atuação (Car)', score: props.initialData.charisma },
        { key: 'Enganação', label: 'Blefar (Car)', score: props.initialData.charisma },
        { key: 'Furtividade', label: 'Furtividade (Des)', score: props.initialData.dexterity },
        { key: 'História', label: 'História (Int)', score: props.initialData.intelligence },
        { key: 'Intimidação', label: 'Intimidação (Car)', score: props.initialData.charisma },
        { key: 'Intuição', label: 'Intuição (Sab)', score: props.initialData.wisdom },
        { key: 'Investigação', label: 'Investigação (Int)', score: props.initialData.intelligence },
        { key: 'Lidar com Animais', label: 'Lidar com Animais (Sab)', score: props.initialData.wisdom },
        { key: 'Medicina', label: 'Medicina (Sab)', score: props.initialData.wisdom },
        { key: 'Natureza', label: 'Natureza (Int)', score: props.initialData.intelligence },
        { key: 'Percepção', label: 'Percepção (Sab)', score: props.initialData.wisdom },
        { key: 'Persuasão', label: 'Persuasão (Car)', score: props.initialData.charisma },
        { key: 'Prestidigitação', label: 'Prestidigitação (Des)', score: props.initialData.dexterity },
        { key: 'Religião', label: 'Religião (Int)', score: props.initialData.intelligence },
        { key: 'Sobrevivência', label: 'Sobrevivência (Sab)', score: props.initialData.wisdom },
    ];

    const savingThrows = [
        { name: 'Força', value: props.initialData.strength },
        { name: 'Destreza', value: props.initialData.dexterity },
        { name: 'Constituição', value: props.initialData.constitution },
        { name: 'Inteligência', value: props.initialData.intelligence },
        { name: 'Sabedoria', value: props.initialData.wisdom },
        { name: 'Carisma', value: props.initialData.charisma },
    ];

    // --- PÁGINA 1 ---
    const renderPage1 = () => (
        <View style={commonStyles.pageContent}>
            <View style={[commonStyles.headerP1, isSmall && commonStyles.headerStack]}>
                <View style={[commonStyles.nameColumn, isSmall && commonStyles.fullWidth]}>
                    <Text style={commonStyles.charNameText}>{props.initialData.characterName}</Text>
                    <Text style={commonStyles.headerLabel}>NOME DO PERSONAGEM</Text>
                </View>
                <View style={[commonStyles.infoColumn, isSmall && commonStyles.fullWidth]}>
                    <View style={commonStyles.headerRow}>
                        <View style={commonStyles.headerField}><Text style={commonStyles.headerValue}>{props.initialData.characterClass} {props.initialData.level}</Text><Text style={commonStyles.headerLabel}>CLASSE E NÍVEL</Text></View>
                        <View style={commonStyles.headerField}><Text style={commonStyles.headerValue}>{props.initialData.characterAntecedent}</Text><Text style={commonStyles.headerLabel}>ANTECEDENTE</Text></View>
                        <View style={commonStyles.headerField}><Text style={commonStyles.headerValue}>{props.userInfo._user.displayName}</Text><Text style={commonStyles.headerLabel}>NOME DO JOGADOR</Text></View>
                    </View>
                    <View style={commonStyles.headerRow}>
                        <View style={commonStyles.headerField}><Text style={commonStyles.headerValue}>{props.initialData.characterRace}</Text><Text style={commonStyles.headerLabel}>RAÇA</Text></View>
                        <View style={commonStyles.headerField}><Text style={commonStyles.headerValue}>{props.initialData.characterTrend}</Text><Text style={commonStyles.headerLabel}>TENDÊNCIA</Text></View>
                        <View style={commonStyles.headerField}><Text style={commonStyles.headerValue}>{props.initialData.experience}</Text><Text style={commonStyles.headerLabel}>XP</Text></View>
                    </View>
                </View>
            </View>

            <View style={[commonStyles.mainGrid, { alignItems: 'stretch' }, isSmall && commonStyles.mainGridStack]}>

                {/* COLUNA 1: ATRIBUTOS + PERÍCIAS (CONTAINER) */}
                <View style={[page1Styles.leftColumnPanel, { flexDirection: 'column' }, isSmall && commonStyles.fullWidth]}>

                    {/* Linha Superior: Atributos | Perícias */}
                    <View style={{ flexDirection: 'row', gap: 2 }}>
                        {/* Atributos */}
                        <View style={page1Styles.attributesStrip}>
                            {attributes.map((attr, index) => (
                                <View key={index} style={page1Styles.attributeContainer}>
                                    <View style={page1Styles.attributeLabelBox}><Text style={page1Styles.attrLabelText}>{attr.label}</Text></View>
                                    <Text style={page1Styles.attrModText}>{formatModifier(calculateModifier(attr.value))}</Text>
                                    <View style={page1Styles.attrScoreCircle}><Text style={page1Styles.attrScoreText}>{attr.value}</Text></View>
                                </View>
                            ))}
                        </View>

                        {/* Painel Skills */}
                        <View style={page1Styles.skillsPanel}>
                            <View style={page1Styles.rowBox}>
                                <View style={page1Styles.inspirationBox}>
                                    <View style={page1Styles.profCircle}>
                                        <Text style={page1Styles.profText}>
                                            0
                                        </Text>
                                    </View>
                                    <Text style={commonStyles.headerLabel}>
                                        INSPIRAÇÃO
                                    </Text>
                                </View>
                                <View style={page1Styles.profBox}>
                                    <View style={page1Styles.profCircle}>
                                        <Text style={page1Styles.profText}>
                                            +{character.proficiencyBonus}
                                        </Text>
                                    </View>
                                    <Text style={commonStyles.headerLabel}>
                                        BÔNUS DE PROEF.
                                    </Text>
                                </View>
                            </View>

                            <View style={page1Styles.borderBox}>
                                {savingThrows.map((save, index) => (
                                    <View key={index} style={page1Styles.skillLine}>
                                        <View style={[page1Styles.radioEmpty, { backgroundColor: selectedSafeguards.includes(save.name) ? '#000' : 'transparent' }]} />
                                        <Text style={page1Styles.skillModSmall}>{formatModifier(calculateModifier(save.value))}</Text>
                                        <Text style={[page1Styles.skillText, { fontWeight: selectedSafeguards.includes(save.name) ? 'bold' : 'normal' }]}>{save.name}</Text>
                                    </View>
                                ))}
                                <Text style={page1Styles.boxTitle}>SALVAGUARDAS</Text>
                            </View>

                            <View style={page1Styles.borderBox}>
                                {skills.map((skill, index) => (
                                    <View key={index} style={page1Styles.skillLine}>
                                        <View style={[page1Styles.radioEmpty, { backgroundColor: selectedSkills.includes(skill.key) ? '#000' : 'transparent' }]} />
                                        <Text style={page1Styles.skillModSmall}>{formatModifier(calculateModifier(skill.score))}</Text>
                                        <Text style={[page1Styles.skillText, { fontWeight: selectedSkills.includes(skill.key) ? 'bold' : 'normal' }]}>{skill.label}</Text>
                                    </View>
                                ))}
                                <Text style={page1Styles.boxTitle}>PERÍCIAS</Text>
                            </View>
                        </View>
                    </View>

                    {/* Itens Inferiores da Coluna 1 */}
                    <View style={page1Styles.passiveBoxRow}>
                        <Text style={page1Styles.passiveVal}>{10 + calculateModifier(props.initialData.wisdom)}</Text>
                        <Text style={page1Styles.passiveLabel}>SABEDORIA PASSIVA (PERCEPÇÃO)</Text>
                    </View>

                    <View style={[page1Styles.borderBox, { minHeight: 100 }]}>
                        <Text style={[page1Styles.textAreaSmall, { flex: 1 }]}>ALGUMA INFORMAÇÃO</Text>
                        <Text style={page1Styles.boxTitle}>OUTRAS PROFICIÊNCIAS E IDIOMAS</Text>
                    </View>
                </View>

                {/* COLUNA 2 */}
                <View style={[page1Styles.centerColumnPanel, isSmall && commonStyles.fullWidth]}>
                    <View style={page1Styles.combatStatsRow}>
                        <View style={page1Styles.shieldBox}>
                            <Text style={page1Styles.shieldVal}>{props.initialBag.armor}</Text>
                            <Text style={page1Styles.boxTitle}>CLASSE DE ARMADURA</Text>
                        </View>
                        <View style={page1Styles.squareStatBox}>
                            <Text style={page1Styles.shieldVal}>{formatModifier(calculateModifier(props.initialData.dexterity))}</Text>
                            <Text style={page1Styles.boxTitle}>INICIATIVA</Text>
                        </View>
                        <View style={page1Styles.squareStatBox}><Text style={page1Styles.shieldVal}>{props.initialData.movement}</Text>
                            <Text style={page1Styles.boxTitle}>DESLOC.</Text>
                        </View>
                    </View>
                    <View style={page1Styles.hpContainer}>
                        <View style={[page1Styles.hpHeader]}>
                            <View style={page1Styles.hpMax}>
                                <Text style={page1Styles.boxTitle}>PONTOS DE VIDA MÁXIMOS</Text>
                                <Text style={page1Styles.hpInputBig}>{props.initialData.life}</Text>
                            </View>
                            <View style={page1Styles.hpNow}>
                                <TextInput style={commonStyles.textArea} keyboardType='numeric' />
                                <Text style={page1Styles.boxTitle}>PONTOS DE VIDA ATUAIS</Text>
                            </View>
                        </View>

                    </View>
                    <View style={[page1Styles.borderBox, { minHeight: 50 }]}>
                        <TextInput style={page1Styles.hpTemp} keyboardType='numeric' />
                        <Text style={page1Styles.boxTitle}>PONTOS DE VIDA TEMPORÁRIOS</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 60 }}>
                        <View style={[page1Styles.borderBox, { flex: 0.47 }]}>
                            <Text style={page1Styles.boxTitle}>DADOS DE VIDA</Text>
                            <Text style={{ flex: 1, color: "black", textAlign: "center", textAlignVertical: "center" }}>1d8</Text>
                        </View>
                        <View style={[page1Styles.borderBox, { flex: 0.47, justifyContent: "space-between" }]}>
                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: "space-between", marginTop: 5}}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0.5, gap: 2, justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 5, color: "black", textAlign:"left" }}>SUCESSOS</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={page1Styles.radioEmpty} />
                                        <View style={page1Styles.radioEmpty} />
                                        <View style={page1Styles.radioEmpty} />
                                    </View>
                                </View>
                                <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0.5, gap: 2, justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 5, color: "black", textAlign:"left" }}>FALHAS</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={page1Styles.radioEmpty} />
                                            <View style={page1Styles.radioEmpty} />
                                            <View style={page1Styles.radioEmpty} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <Text style={{ fontSize: 4, color: "black" }}>SALVAGUARDA CONTRA MORTE</Text>
                        </View>
                    </View>
                    <View style={[page1Styles.borderBox, { flex: 0.5, minHeight: 100 }]}>
                        <View style={{ flex: 1, padding: 2 }}>
                            <Text style={{ color: "black", fontSize: 10 }}>alguma informação</Text>
                        </View>
                        <Text style={{ textAlign: "center", width: "100%", fontSize: 6, color: "black", fontWeight: 'bold' }}>
                            ATAQUES & CONJURAÇÕES
                        </Text>
                    </View>
                    <View style={[page1Styles.borderBox, { flex: 1 }]}>
                        <View style={{ flex: 1, flexDirection: "row", gap: 5 }}>

                            {/* Lado das Moedas */}
                            <View style={{ width: 33, paddingTop: 5 }}>
                                {['PC', 'PP', 'PE', 'PO', 'PL'].map((label, index) => {
                                    const values = [props.initialBag.copper, props.initialBag.silver, props.initialBag.electrum, props.initialBag.gold, props.initialBag.platina];
                                    return (
                                        <View key={label} style={{ flexDirection: "row", alignItems: "center", marginBottom: 2, marginLeft: -4 }}>
                                            <Text style={[page1Styles.borderBox, { color: "black", fontSize: 5, backgroundColor: "white", textAlign: "center", width: 16, marginBottom: 0 }]}>{label}</Text>
                                            <View style={[page1Styles.borderBox, { width: 22, height: 18, justifyContent: "center", alignItems: "center", marginBottom: 0, marginLeft: 2 }]}>
                                                <Text style={{ color: "black", fontSize: 10 }}>{values[index]}</Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                            <View style={{ flex: 1}}>
                                <View style={{ flex: 1, paddingBottom: 2 }}>
                                    <ScrollView
                                        nestedScrollEnabled={true}
                                        style={{ flex: 1, width: '100%' }}
                                        contentContainerStyle={{ flexGrow: 1 }}
                                    >
                                        <Text style={{ fontSize: 8, color: "black", padding: 4 }}>
                                            {props.initialBag.items}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                        <Text style={page1Styles.boxTitle}>EQUIPAMENTO</Text>
                    </View>
                </View>

                {/* COLUNA 3 */}
                <View style={[page1Styles.rightColumnPanel, isSmall && commonStyles.fullWidth]}>
                    <View style={[page1Styles.borderBox, { minHeight: 60 }]}><Text style={page1Styles.boxTitle}>TRAÇOS DE PERSONALIDADE</Text></View>
                    <View style={[page1Styles.borderBox, { minHeight: 60 }]}><Text style={page1Styles.boxTitle}>IDEAIS</Text></View>
                    <View style={[page1Styles.borderBox, { minHeight: 60 }]}><Text style={page1Styles.boxTitle}>LIGAÇÕES</Text></View>
                    <View style={[page1Styles.borderBox, { minHeight: 60 }]}><Text style={page1Styles.boxTitle}>DEFEITOS</Text></View>
                    <View style={[page1Styles.borderBox, { flex: 1 }]}><Text style={page1Styles.boxTitle}>CARACTERÍSTICAS E HABILIDADES</Text></View>
                </View>
            </View>
        </View>
    );

    // --- PÁGINA 2: DETALHES ---
    const renderPage2 = () => (
        <View style={commonStyles.pageContent}>
            <View style={commonStyles.headerP2}>
                <View style={commonStyles.nameColumn}>
                    <Text style={commonStyles.charNameText}>{props.initialData.characterName}</Text>
                    <Text style={commonStyles.headerLabel}>NOME DO PERSONAGEM</Text>
                </View>
                <View style={commonStyles.infoColumn}>
                    <View style={commonStyles.headerRow}>
                        <View style={commonStyles.headerField}><TextInput style={commonStyles.tinyInput} /><Text style={commonStyles.headerLabel}>IDADE</Text></View>
                        <View style={commonStyles.headerField}><TextInput style={commonStyles.tinyInput} /><Text style={commonStyles.headerLabel}>ALTURA</Text></View>
                        <View style={commonStyles.headerField}><TextInput style={commonStyles.tinyInput} /><Text style={commonStyles.headerLabel}>PESO</Text></View>
                    </View>
                    <View style={commonStyles.headerRow}>
                        <View style={commonStyles.headerField}><TextInput style={commonStyles.tinyInput} /><Text style={commonStyles.headerLabel}>OLHOS</Text></View>
                        <View style={commonStyles.headerField}><TextInput style={commonStyles.tinyInput} /><Text style={commonStyles.headerLabel}>PELE</Text></View>
                        <View style={commonStyles.headerField}><TextInput style={commonStyles.tinyInput} /><Text style={commonStyles.headerLabel}>CABELOS</Text></View>
                    </View>
                </View>
            </View>

            <View style={[commonStyles.mainGrid, isSmall && commonStyles.mainGridStack]}>
                <View style={[commonStyles.columnOne, isSmall && commonStyles.fullWidth]}>
                    <View style={page2Styles.imgBox}><Text style={{ fontSize: 10, color: '#ccc' }}>IMAGEM</Text></View>
                    <View style={[commonStyles.borderBox, { flex: 1, minHeight: 150 }]}>
                        <TextInput style={commonStyles.textArea} multiline placeholder="Aparência..." />
                        <Text style={commonStyles.boxTitle}>APARÊNCIA DO PERSONAGEM</Text>
                    </View>
                </View>
                <View style={[commonStyles.columnTwo, isSmall && commonStyles.fullWidth]}>
                    <View style={[commonStyles.borderBox, { minHeight: 150 }]}>
                        <TextInput style={commonStyles.textArea} multiline placeholder="Aliados..." />
                        <Text style={commonStyles.boxTitle}>ALIADOS E ORGANIZAÇÕES</Text>
                    </View>
                    <View style={[commonStyles.borderBox, { flex: 1, minHeight: 200 }]}>
                        <TextInput style={commonStyles.textArea} multiline placeholder="História..." />
                        <Text style={commonStyles.boxTitle}>HISTÓRIA DO PERSONAGEM</Text>
                    </View>
                </View>
                <View style={[commonStyles.columnThree, isSmall && commonStyles.fullWidth]}>
                    <View style={[commonStyles.borderBox, { minHeight: 200 }]}>
                        <TextInput style={commonStyles.textArea} multiline placeholder="Outras características..." />
                        <Text style={commonStyles.boxTitle}>OUTRAS CARACTERÍSTICAS</Text>
                    </View>
                    <View style={[commonStyles.borderBox, { flex: 1, minHeight: 150 }]}>
                        <TextInput style={commonStyles.textArea} multiline placeholder="Tesouros..." />
                        <Text style={commonStyles.boxTitle}>TESOURO</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    // --- PÁGINA 3: MAGIAS ---
    const renderPage3 = () => (
        <View style={commonStyles.pageContent}>
            <View style={page3Styles.spellHeaderContainer}>
                <View style={page3Styles.spellHeaderBlock}>
                    <TextInput style={page3Styles.headerValueInput} />
                    <Text style={page3Styles.headerLabel}>CLASSE DE CONJURADOR</Text>
                </View>
                <View style={page3Styles.spellHeaderRow}>
                    <View style={page3Styles.spellStatBox}><TextInput style={page3Styles.headerValueInput} /><Text style={page3Styles.headerLabel}>HABILIDADE CHAVE</Text></View>
                    <View style={page3Styles.spellStatBox}><TextInput style={page3Styles.headerValueInput} keyboardType="numeric" /><Text style={page3Styles.headerLabel}>CD DO TR</Text></View>
                    <View style={page3Styles.spellStatBox}><TextInput style={page3Styles.headerValueInput} /><Text style={page3Styles.headerLabel}>BÔNUS DE ATAQUE</Text></View>
                </View>
            </View>

            <View style={[commonStyles.mainGrid, isSmall && commonStyles.mainGridStack]}>
                <View style={[commonStyles.columnOne, isSmall && commonStyles.fullWidth]}>
                    <View style={page3Styles.spellLevelBox}>
                        <View style={page3Styles.levelHeader}><Text style={page3Styles.levelTitle}>0 - TRUQUES</Text></View>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <TextInput key={i} style={page3Styles.spellLine} />)}
                    </View>
                    {[1, 2].map(level => (
                        <View key={level} style={page3Styles.spellLevelBox}>
                            <View style={page3Styles.levelHeader}>
                                <Text style={page3Styles.levelTitle}>{level}</Text>
                                <View style={page3Styles.slotsBox}><TextInput style={page3Styles.slotInput} placeholder="Total" /><TextInput style={page3Styles.slotInput} placeholder="Usados" /></View>
                            </View>
                            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}><View style={page3Styles.radioEmpty} /><TextInput style={page3Styles.spellLine} /></View>
                            ))}
                        </View>
                    ))}
                </View>

                <View style={[commonStyles.columnTwo, isSmall && commonStyles.fullWidth]}>
                    {[3, 4, 5].map(level => (
                        <View key={level} style={page3Styles.spellLevelBox}>
                            <View style={page3Styles.levelHeader}>
                                <Text style={page3Styles.levelTitle}>{level}</Text>
                                <View style={page3Styles.slotsBox}><TextInput style={page3Styles.slotInput} placeholder="Total" /><TextInput style={page3Styles.slotInput} placeholder="Usados" /></View>
                            </View>
                            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}><View style={page3Styles.radioEmpty} /><TextInput style={page3Styles.spellLine} /></View>
                            ))}
                        </View>
                    ))}
                </View>

                <View style={[commonStyles.columnThree, isSmall && commonStyles.fullWidth]}>
                    {[6, 7, 8, 9].map(level => (
                        <View key={level} style={page3Styles.spellLevelBox}>
                            <View style={page3Styles.levelHeader}>
                                <Text style={page3Styles.levelTitle}>{level}</Text>
                                <View style={page3Styles.slotsBox}><TextInput style={page3Styles.slotInput} placeholder="Total" /><TextInput style={page3Styles.slotInput} placeholder="Usados" /></View>
                            </View>
                            {[1, 2, 3, 4, 5].map(i => (
                                <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}><View style={page3Styles.radioEmpty} /><TextInput style={page3Styles.spellLine} /></View>
                            ))}
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    return (
        <Modal visible={true} transparent={true} onRequestClose={props.onClose}>
            <View style={commonStyles.container}>
                <View style={commonStyles.navigation}>
                    <View style={commonStyles.navGroup}>
                        {[1, 2, 3].map(pageNum => (
                            <TouchableOpacity
                                key={pageNum}
                                style={[commonStyles.navButton, currentPage === pageNum && commonStyles.navButtonActive]}
                                onPress={() => setCurrentPage(pageNum)}
                            >
                                <Text style={[commonStyles.navButtonText, currentPage === pageNum && commonStyles.navButtonTextActive]}>
                                    {pageNum === 3 ? "Magias" : `Pág ${pageNum}`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity style={commonStyles.closeButton} onPress={props.onClose}>
                        <Text style={commonStyles.closeButtonText}>Fechar X</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={commonStyles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
                    {currentPage === 1 && renderPage1()}
                    {currentPage === 2 && renderPage2()}
                    {currentPage === 3 && renderPage3()}
                </ScrollView>
            </View>
        </Modal>
    );
}

// =========================================================================
// ESTILOS SEPARADOS POR PÁGINA
// =========================================================================

// 1. ESTILOS COMUNS
const commonStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    scrollView: { flex: 1, backgroundColor: '#fff', margin: 10, borderRadius: 8, overflow: 'hidden' },
    pageContent: { padding: 10, paddingBottom: 40 },

    // Header & Nav
    navigation: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc', marginHorizontal: 10, marginTop: 10, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
    navGroup: { flexDirection: 'row', gap: 5 },
    navButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ccc' },
    navButtonActive: { backgroundColor: '#333', borderColor: '#000' },
    navButtonText: { fontSize: 10, fontWeight: 'bold', color: '#333' },
    navButtonTextActive: { color: '#fff' },
    closeButton: { backgroundColor: '#b30202', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4 },
    closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 10 },

    headerP1: { flexDirection: 'row', marginBottom: 10, gap: 5, minHeight: 60 },
    headerP2: { flexDirection: 'row', marginBottom: 10, gap: 5, minHeight: 60 },
    headerStack: { flexDirection: 'row' },
    nameColumn: { flex: 0.35, backgroundColor: '#f5f5f5', borderRadius: 5, padding: 5, justifyContent: 'flex-end', borderBottomWidth: 2, borderColor: '#444' },
    charNameText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    infoColumn: { flex: 0.65, justifyContent: 'space-between', gap: 5 },
    headerRow: { flexDirection: 'row', gap: 5 },
    headerRowStack: { flexDirection: 'column' },
    headerField: { flex: 1, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 1, justifyContent: 'flex-end' },
    headerValue: { fontSize: 10, fontWeight: 'bold', color: '#000' },
    headerLabel: { fontSize: 6, color: '#666', fontWeight: 'bold', textTransform: 'uppercase' },
    fullWidth: { width: '100%', marginBottom: 5 },

    // Grid Layout
    mainGrid: { flexDirection: 'row', gap: 5, alignItems: 'stretch' },
    mainGridStack: { flexDirection: 'column' },
    columnOne: { flex: 1, gap: 5 },
    columnTwo: { flex: 1, gap: 5 },
    columnThree: { flex: 1, gap: 5 },

    // Boxes & Inputs
    borderBox: { borderWidth: 1, borderRadius: 5, padding: 2, marginBottom: 2, borderColor: '#333' },
    boxTitle: { fontSize: 6, fontWeight: 'bold', textAlign: 'center', marginTop: 1, color: '#666', textTransform: 'uppercase' },
    textArea: { flex: 1, textAlignVertical: 'top', fontSize: 16, padding: 2, color: '#000' },
    tinyInput: { flex: 1, fontSize: 8, borderBottomWidth: 1, borderColor: '#eee', height: 15, padding: 0, textAlign: 'center', color: '#000' },
});

// 2. ESTILOS PÁGINA 1
const page1Styles = StyleSheet.create({
    leftColumnPanel: { flex: 0.39, flexDirection: 'row', gap: 2 },
    centerColumnPanel: { flex: 0.34, gap: 2 },
    rightColumnPanel: { flex: 0.25, gap: 2 },

    attributesStrip: { width: 50, alignItems: 'center', justifyContent: 'space-between' },
    attributeContainer: { alignItems: 'center', marginBottom: 5, width: 45, height: 55, borderWidth: 1, borderRadius: 5, borderColor: '#333', backgroundColor: '#fff' },
    attributeLabelBox: { backgroundColor: '#eee', width: '100%', alignItems: 'center', borderTopLeftRadius: 4, borderTopRightRadius: 4, paddingVertical: 1 },
    attrLabelText: { fontSize: 6, fontWeight: 'bold', color: '#000' },
    attrModText: { fontSize: 18, fontWeight: 'bold', marginVertical: 0, color: '#000' },
    attrScoreCircle: { position: 'absolute', bottom: -7, backgroundColor: '#fff', borderWidth: 1, borderRadius: 10, width: 30, height: 20, alignItems: 'center', justifyContent: 'center' },
    attrScoreText: { fontSize: 14, color: '#000' },

    skillsPanel: { flex: 1 },
    rowBox: { flexDirection: 'column', gap: 2, marginBottom: 2, height: 50 },
    inspirationBox: { borderWidth: 1, borderRadius: 5, height: 30, flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 2, borderColor: '#333' },
    profBox: { borderWidth: 1, borderRadius: 5, height: 30, flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 2, borderColor: '#333' },
    profCircle: { borderWidth: 1, borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', marginRight: 2, borderColor: '#333' },
    profText: { fontSize: 8, fontWeight: 'bold', color: '#000' },

    borderBox: { borderWidth: 1, borderRadius: 5, padding: 2, marginBottom: 2, borderColor: '#333' },
    skillLine: { flexDirection: 'row', alignItems: 'center', marginBottom: 1 },
    radioEmpty: { width: 6, height: 6, borderRadius: 3, borderWidth: 1, marginRight: 2, borderColor: '#333' },
    skillModSmall: { fontSize: 8, width: 12, textAlign: 'center', marginRight: 2, borderBottomWidth: 1, borderColor: '#ccc', color: '#000' },
    skillText: { fontSize: 6, flex: 1, flexWrap: 'wrap', color: '#000' },
    expertiseText: { fontSize: 6, flex: 1, flexWrap: 'wrap', color: '#000' },
    boxTitle: { fontSize: 5, fontWeight: 'bold', textAlign: 'center', marginTop: 1, color: '#666', textTransform: 'uppercase' },

    // --- ITENS ADICIONADOS PARA SABEDORIA PASSIVA E IDIOMAS ---
    passiveBoxRow: { flexDirection: 'row', borderWidth: 1, borderRadius: 15, padding: 2, alignItems: 'center', height: 30, borderColor: '#333', marginBottom: 5, marginTop: 5 },
    passiveVal: { fontSize: 12, fontWeight: 'bold', marginRight: 8, marginLeft: 8, color: '#000' },
    passiveLabel: { fontSize: 7, color: '#666', flex: 1, fontWeight: 'bold' },
    textAreaSmall: { flex: 1, textAlignVertical: 'top', fontSize: 8, padding: 2, color: '#000' },
    // ----------------------------------------------------------

    combatStatsRow: { flexDirection: 'row', justifyContent: 'space-between', height: 50 },
    shieldBox: { flex: 1, borderWidth: 2, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, alignItems: 'center', justifyContent: 'center', marginHorizontal: 1, borderColor: '#333' },
    squareStatBox: { flex: 1, borderWidth: 2, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginHorizontal: 1, borderColor: '#333' },
    shieldVal: { fontSize: 16, fontWeight: 'bold', color: '#000' },

    hpContainer: { borderWidth: 1, borderRadius: 5, padding: 2, minHeight: 70, alignItems: 'center', borderColor: '#333', justifyContent: 'space-between' },
    hpHeader: { width: '100%', flexDirection: 'column', justifyContent: 'space-between', paddingHorizontal: 5, flex: 1 },
    hpMax: { justifyContent: 'space-between', flexDirection: 'row', width: '100%', alignItems: 'center' },
    hpNow: { justifyContent: "flex-end", textAlign: 'center', flexDirection: 'column', height: '50%', width: '100%', alignItems: 'center' },
    hpTemp: { flex: 1, textAlign: 'center', padding: 2, color: '#000', height: '50%', fontSize: 12 },
    hpInputBig: { fontSize: 14, fontWeight: 'bold', color: '#000' },

    atkRow: { flexDirection: 'row', backgroundColor: '#eee', padding: 1 },
    atkRowInput: { flexDirection: 'row', marginBottom: 1 },
    tinyInput: { flex: 1, fontSize: 8, borderBottomWidth: 1, borderColor: '#eee', height: 15, padding: 0, textAlign: 'center', color: '#000' },

    coinsColumn: { width: 30, alignItems: 'center', borderRightWidth: 1, borderColor: '#ccc', justifyContent: 'space-around' },
    coinLabel: { fontSize: 6, fontWeight: 'bold', textAlign: 'center', color: '#666' },
    coinInput: { fontSize: 8, textAlign: 'center', borderBottomWidth: 1, width: 20, height: 12, marginBottom: 2, color: '#000' },
    equipmentText: { fontSize: 7, textAlignVertical: 'top', color: '#000', flex: 1 },

    traitContainer: { borderWidth: 1, borderRadius: 5, padding: 3, minHeight: 40, borderColor: '#333' },
    traitLabel: { fontSize: 6, fontWeight: 'bold', color: '#000' },
});

// 3. ESTILOS PÁGINA 2
const page2Styles = StyleSheet.create({
    imgBox: { height: 150, borderWidth: 2, borderColor: '#ccc', borderRadius: 5, marginBottom: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
});

// 4. ESTILOS PÁGINA 3
const page3Styles = StyleSheet.create({
    spellHeaderContainer: { borderWidth: 2, borderColor: '#333', borderRadius: 8, padding: 5, marginBottom: 10, backgroundColor: '#f5f5f5' },
    spellHeaderBlock: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 5, alignItems: 'center' },
    spellHeaderRow: { flexDirection: 'row', justifyContent: 'space-around' },
    spellStatBox: { alignItems: 'center', width: '30%' },
    headerValueInput: { fontSize: 12, fontWeight: 'bold', color: '#000', textAlign: 'center', width: '100%', padding: 0 },
    headerLabel: { fontSize: 6, color: '#666', fontWeight: 'bold', textTransform: 'uppercase' },

    spellLevelBox: { borderWidth: 1, borderColor: '#333', borderRadius: 5, marginBottom: 10, overflow: 'hidden' },
    levelHeader: { flexDirection: 'row', backgroundColor: '#eee', padding: 2, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#ccc' },
    levelTitle: { fontSize: 14, fontWeight: 'bold', marginLeft: 5, color: '#000' },
    slotsBox: { flexDirection: 'row', gap: 5 },
    slotInput: { backgroundColor: '#fff', width: 40, height: 20, fontSize: 8, textAlign: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 3, color: '#000' },
    spellLine: { borderBottomWidth: 1, borderColor: '#eee', height: 20, flex: 1, marginLeft: 2, fontSize: 9, padding: 0, color: '#000' },
    radioEmpty: { width: 6, height: 6, borderRadius: 3, borderWidth: 1, marginRight: 2, borderColor: '#333' },
});