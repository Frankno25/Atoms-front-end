(function($){
  $("#fkno-quests .items").append($("#formHead-template").html());
  $("#fkno-quests .items").append($("#itemDefault-template").html());
  $(".items #removeAfterAdd").attr("id","");
  /**
   * @Name Editable label
   * @Description au clic sur le label, on peut l'éditer
   * @Author Frankno
   * @version  1.0
   */
  $.fn.fEditableLabel = function(options){
    return this.each(function(){
      $(this).on("focus", function(){
        $(this).select();
      })
    })
  }

  /**
   * @Name Block item
   * @Description Ce qui contient les éléments nécéssaire pour créer les questionnaires
   * @Author Frankno
   * @version  1.0
   */
  $.fn.fBlockItem = function(options){
    return this.each(function(){
      $(this).on("click", function(){
        $(".items__item").removeClass("items__item--active");
        $(this).addClass("items__item--active").fadeIn("slow");
        //On compte le nombre des items dans le bloc actif
        nbElementOption = $(".items__item--active .option__item").not(".show-on-active").length;
        ajoutOption("radio", nbElementOption);
        $(".container-actions").animate({
          top: $(".items__item--active").offset().top - 150
        }, 150, "linear");
        return false;
        console.log(nbElementOption);
      })
    })
  }

  /**
   * @Name  Ajouter option
   * @Description au clic sur ajouter une option, on l'ajoute selon le type de l'option
   * @Author  Frankno
   * @version  1.0
   */
    function ajoutOption(typeElement, increment){
      $(".autreOption").off().on("click", function(event){
        increment += 1;
        var cloneElement = $(this).parents(".option__item").prev().clone();
        cloneElement.find(".number").text(increment + ".");
        cloneElement.find("input").attr("name", typeElement + "" + increment);
        cloneElement.find("input").attr("placeholder", "Option " + increment);
        if($(".items__item--active .others-item").length > 0){
          $(this).parents(".option__item").prev().before(cloneElement);
        }
        else{
          $(this).parents(".option__item").before(cloneElement);
        }
        event.stopPropagation();
      });
      $(".autre").off().on("click", function(event){
        var cloneElement = $(this).parents(".option__item").prev().clone();
        cloneElement.find("input").attr("name", typeElement + "Autres");
        cloneElement.find("input").data("type", typeElement + "Autres");
        cloneElement.find("input").attr("placeholder", "Autres...");
        cloneElement.find("input").prop("disabled", true);
        $(this).parents(".option__item").addClass("others-item").before(cloneElement);

        $(this).remove();
        event.stopPropagation();
      })
    }

  /**
   * @Name Select box
   * @Description Créer un select box personnalisé et intélligent
   * @NB a_ : array, e_ : element, n_ : number
   * @Author Frankno
   * @Version 1.0
   */

  $.fn.fQuests = function(options){
    var _ = this;
    var e_simpleText, e_paragraphe, e_mail, e_password, e_radio, e_checkbox, e_select, e_autocomplete, e_date, e_heure;
    var nbAjout = 1;
    var defaults = {
      "iconeList" : false,
      "class"     : "select_list",
      "classActive": "select_list__item--active",
      "selectedItem" : ""
    }

    //On fusionne les 2 objets
    var e_parametres = $.extend(defaults, options);
    return _.each(function(){
      var selected = "Choix multiples";
      var a_options   = $(this).find("option").get();//On récupère les options dans le select box et on les stock dans un tableau (ici a_options)
      var a_optGroup  = $(this).find("optgroup").get();//On récupère les optgroup s'ils existent dans le select box et on les stock dans un tableau (ici optGroup)
      var a_indexGroup = [];

      if(a_optGroup.length > 0){
        //var calcChild =
        var n_childGroup = 0;
        $.each(a_optGroup, function(index){
          n_childGroup += $(this).find("option").length;
          a_indexGroup.push(n_childGroup);
        })
      }

      if(a_options.length > 0){//Si au moins une option existe
        var e_containerSelect = $("<div class='fContainerSelect'></div>");
        var e_newSelect = $("<ul class='" + e_parametres.class + "'></ul>");
        var e_result = $("<div class='choice' select-value='choixMultiple'>" + selected + "</div>");

        //On copie les éléments du select box sous autre forme (list)
        $.each(a_options, function(index){
          var e_newOption = $("<li class='select_list__item' value='" + $(this).val() + "'>" + $(this).text() + "</li>");
          e_newSelect.append(e_newOption);

          if(a_indexGroup != []){
            var separator = $("<hr/>");
            $.each(a_indexGroup, function(indexGroup, value){
              if(index == (value - 1)){
                e_newSelect.append(separator);
              }
            })
          }
        })
        e_containerSelect.append(e_result).append(e_newSelect);
        $(this).after(e_containerSelect);
        $(this).hide();
      }

      /**
       * Actions
       */
      //Afficher la liste au clic sur le nouveau select box
      var s_itemActive = ".items__item--active";
      $(".choice").on("click", function(){
        var n_heightScreen = $(window).height();
        var n_heightPopup = $(s_itemActive + " .select_list").height();
        var n_posSelect = $(this).offset().top;
        var scrollTop = $(window).scrollTop();
        var n_topPopup;
        if(n_heightScreen > n_heightPopup){
          n_topPopup = n_posSelect - (n_heightPopup / 3) - scrollTop;
        }
        else{
          n_topPopup = 100;
        }
        $(this).next().css({
          "display": "block",
          "opacity": "1",
          "top": n_topPopup + "px"
        });
      })

      //Affecter l'élément choisi sur la liste
      $(".select_list__item").on("click", function(){
        var value = $(this).attr("value");
        $(s_itemActive + " .select_list__item").removeClass(e_parametres.classActive);
        $(this).addClass(e_parametres.classActive);
        $(s_itemActive + " .choice").html($(this).html());
        $(s_itemActive + " .choice").attr("select-value", value);
        $(s_itemActive + " ." + e_parametres.class).css({
          "display":"none"
        });

        //Gestion des options à afficher
        var optionRecent = $(s_itemActive + " .option").children();
        var classOptionRecent = optionRecent.attr("class");
        var modifierOption;

        switch(value){
          case "reponseCourte":
            if(classOptionRecent.indexOf("text") < 0){
              modifierOption = "text";
              if(optionRecent.has(".show-on-active")){
                $(".items__item--active .show-on-active").remove();
              }
              $(".items__item--active .option__item").not(":first").remove();
              optionRecent.attr("class","option__item option__item--" + modifierOption);
              if(e_simpleText == undefined){
                e_simpleText = $("<input type='text' disabled value='Reponse courte'/>");
              }
              optionRecent.html(e_simpleText);

            }
            break;
          case "paragraphe":
            if(classOptionRecent.indexOf("paragraphe") < 0){
              modifierOption = "paragraphe";
              if(optionRecent.has(".show-on-active")){
                $(".items__item--active .show-on-active").remove();
              }
              $(".items__item--active .option__item").not(":first").remove();
              optionRecent.attr("class","option__item option__item--" + modifierOption);
              if(e_paragraphe == undefined){
                e_paragraphe = $("<input type='text' disabled value='Reponse longue'/>");
              }
              optionRecent.html(e_paragraphe);
            }
            break;
          case "email":
            if(classOptionRecent.indexOf("email") < 0){
              modifierOption = "email";
              if(optionRecent.has(".show-on-active")){
                $(".items__item--active .show-on-active").remove();
              }
              $(".items__item--active .option__item").not(":first").remove();
              optionRecent.attr("class","option__item option__item--" + modifierOption);
              if(e_mail == undefined){
                e_mail = $("<input type='email' disabled value='Email'/>");
              }
              optionRecent.html(e_mail);
            }
            break;
          case "password":
            if(classOptionRecent.indexOf("password") < 0){
              modifierOption = "password";
              if(optionRecent.has(".show-on-active")){
                $(".items__item--active .show-on-active").remove();
              }
              $(".items__item--active .option__item").not(":first").remove();
              optionRecent.attr("class","option__item option__item--" + modifierOption);
              if(e_password == undefined){
                e_password = $("<input type='password' disabled value='Mot de passe'/>");
              }
              optionRecent.html(e_password);
            }
            break;
          case "choixMultiple":
            if(classOptionRecent.indexOf("radio") < 0){
              var nbItem = $(".items__item--active .option > .option__item").not(".show-on-active").get();
              modifierOption = "radio";
              var classItem = "option__item option__item--" + modifierOption ;
              if(optionRecent.has(".show-on-active")){
                $(".items__item--active .show-on-active").remove();
              }
              optionRecent.not(".show-on-active").attr("class",classItem);
              optionRecent.has(".show-on-active").attr("class", classItem + " show-on-active");
              var labelIndex = 1;
              $.each(nbItem, function(index){
                labelIndex = index + 1;
                console.log("labelIndex radio : " + labelIndex);
                var e_itemRecent = $(s_itemActive + " .option > .option__item:nth-child(" + labelIndex + ")");
                e_radio = $("<div class='editable-label hover'><input type='text' name='radio" + labelIndex + "' class='editable-input sm-input' id='option" + labelIndex + "' placeholder='Option " + labelIndex + "' value=''/><span></span></div>");
                e_itemRecent.not(".show-on-active").html(e_radio);
              });
              var e_autreOption = $("<div class='" + classItem + " show-on-active'><div class='ajout-option'><span class='autreOption'>Ajouter une option</span><span class='autre'> or ajouter 'autre'</span></div></div>");
              optionRecent.parent().append(e_autreOption);
              ajoutOption("radio",labelIndex);
            }
            break;
          case "caseACocher":
            if(classOptionRecent.indexOf("checkbox") < 0){ // si les questionnaire ne sont pas encore des checkbox
              var nbItem = $(".items__item--active .option > .option__item").not(".show-on-active").get(); // On récupère dans un tableau les items (pour savoir leur nombre)
              var tailleItem = nbItem.length;
              modifierOption = "checkbox";
              var classItem = "option__item option__item--" + modifierOption ;
              if(optionRecent.has(".show-on-active")){ // s'il y a déjà l'ajout option, on le supprime pour ajouter une autre spécifique au item
                $(".items__item--active .show-on-active").remove();
              }
              optionRecent.not(".show-on-active").attr("class",classItem);
              optionRecent.has(".show-on-active").attr("class", classItem + " show-on-active");
              var labelIndex = 1;
              $.each(nbItem, function(index){ // S'il y plusieurs items, il faut les parcourir pour ajouter les bonnes identifications afin de les différencier les uns aux autres
                labelIndex = index + 1;
                var e_itemRecent = $(s_itemActive + " .option > .option__item:nth-child(" + labelIndex + ")");
                e_checkbox = $("<div class='editable-label hover'><input type='text' name='checkbox " + labelIndex + "' class='editable-input sm-input' id='option" + labelIndex + "' placeholder='Option " + labelIndex + "' value=''/><span></span></div>");
                e_itemRecent.not(".show-on-active").html(e_checkbox);
              });
              //
              var e_autreOption = $("<div class='" + classItem + " show-on-active'><div class='ajout-option'><span class='autreOption'>Ajouter une option</span><span class='autre'> or ajouter 'autre'</span></div></div>");
              optionRecent.parent().append(e_autreOption);
              ajoutOption("checkbox", labelIndex);
            }
            break;
          case "listeDeroulante":
            if(classOptionRecent.indexOf("select") < 0){
              var nbItem = $(".items__item--active .option > .option__item").not(".show-on-active").get();
              modifierOption = "select";
              var classItem = "option__item option__item--" + modifierOption ;
              if(optionRecent.has(".show-on-active")){
                $(".items__item--active .show-on-active").remove();
              }
              optionRecent.not(".show-on-active").attr("class",classItem);
              optionRecent.has(".show-on-active").attr("class", classItem + " show-on-active");
              var labelIndex = 1;
              $.each(nbItem, function(index){
                labelIndex = index + 1;
                var e_itemRecent = $(s_itemActive + " .option > .option__item:nth-child(" + labelIndex + ")");
                e_select = $("<span class='number'>" + labelIndex + ".</span><div class='editable-label hover'><input type='text' name='select" + labelIndex + "' class='editable-input sm-input' id='option" + labelIndex + "' placeholder='Option " + labelIndex + "' value=''/><span></span></div>");
                e_itemRecent.not(".show-on-active").html(e_select);
              });
              var e_autreOption = $("<div class='" + classItem + " show-on-active'><div class='ajout-option'><span class='autreOption'>Ajouter une option</span></div></div>");
              optionRecent.parent().append(e_autreOption);
              ajoutOption("select", labelIndex);
            }
            break;
          case "autoComplete":
            if(classOptionRecent.indexOf("autocomplete") < 0){
              var nbItem = $(".items__item--active .option > .option__item").not(".show-on-active").get();
              modifierOption = "autocomplete";
              var classItem = "option__item option__item--" + modifierOption ;
              if(optionRecent.has(".show-on-active")){
                $(".items__item--active .show-on-active").remove();
              }
              optionRecent.not(".show-on-active").attr("class",classItem);
              optionRecent.has(".show-on-active").attr("class", classItem + " show-on-active");
              var labelIndex = 1;
              $.each(nbItem, function(index){
                labelIndex = index + 1;
                var e_itemRecent = $(s_itemActive + " .option > .option__item:nth-child(" + labelIndex + ")");
                e_autocomplete = $("<span class='number'>" + labelIndex + ".</span><div class='editable-label hover'><input type='text' name='option" + labelIndex + "' class='editable-input sm-input' id='option" + labelIndex + "' placeholder='Option " + labelIndex + "' value=''/><span></span></div>");
                e_itemRecent.not(".show-on-active").html(e_autocomplete);
              });
              var e_autreOption = $("<div class='" + classItem + " show-on-active'><div class='ajout-option'><span class='autreOption'>Ajouter une option</span></div></div>");
              optionRecent.parent().append(e_autreOption);
              ajoutOption("autoComplete", labelIndex);
            }
            break;
          case "date":
            if(classOptionRecent.indexOf("date") < 0){
              modifierOption = "date";
              if(optionRecent.has(".show-on-active")){
                $(".items__item--active .show-on-active").remove();
              }
              $(".items__item--active .option__item").not(":first").remove();
              optionRecent.attr("class","option__item option__item--" + modifierOption);
              if(e_date == undefined){
                e_date = $("<input type='date' disabled value='Reponse courte'/>");
              }
              optionRecent.html(e_date);
            }
            break;
          case "heure":
            if(classOptionRecent.indexOf("heure") < 0){
              modifierOption = "heure";
              if(optionRecent.has(".show-on-active")){
                $(".items__item--active .show-on-active").remove();
              }
              $(".items__item--active .option__item").not(":first").remove();
              optionRecent.attr("class","option__item option__item--" + modifierOption);
              if(e_heure == undefined){
                e_heure = $("<input type='time' disabled value='Reponse courte'/>");
              }
              optionRecent.html(e_heure);
            }
            break;
          default:
        }
      })

      //Fermer le popup si on click à l'exterieur
      $("body").on("click", function(event){
        if((event.target.className != "select_list__item") && (event.target.className != "choice")){
          $("." + e_parametres.class).css({
            "display":"none"
          });
        }
      })


      //clic sur les boutons ajouter question, ...
      $(".actions__add--head").off().on("click", function(event){
        $(".items").append($("#title-template").html());
        $(".items__item").fBlockItem();
        $(".items #removeAfterAdd1").attr("id", "");
      });

      $(".actions__add--quest").off().on("click", function(event){
        $(".items").append($("#itemDefault-template").html());
        $(".items #removeAfterAdd .fQuests").fQuests();
        $(".items #removeAfterAdd").attr("id","");
      });

      //Initialisation des blocks et labels cliquable
      $(".editable-label > input[type='text']").fEditableLabel();
      $(".items__item").fBlockItem();

      //position du bloc action à droite au scroll
      /*var timer;
      $(window).on("scroll", function(){
        if(timer != undefined){
          timer = clearTimeout();
        }
        timer = setTimeout(function(){
          var blockAction   = $(".container-actions").offset().top;
          var heightBlock   = $(".container-actions").height();
          var scrollTop     = $(window).scrollTop();
          var bottomBlock   = blockAction + heightBlock;
          var heightScreen  = $(window).height();
          console.log("blockAction : " + blockAction);
          console.log("scrollTop : " + scrollTop);
          if(blockAction <= scrollTop){
            $(".container-actions").animate({
              top: 15 + scrollTop,
              bottom: "auto"
            }, 150, "linear");
          }
          if(bottomBlock > heightScreen){
            $(".container-actions").animate({
              bottom: 0,
              top: "auto"
            }, 150, "linear");
          }
        }, 2000);
      });*/
    })
  }
})(jQuery);

